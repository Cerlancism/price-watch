//@ts-check
import yahooFinance from 'yahoo-finance2';
import ccxt from 'ccxt'

import { Webhook } from 'discord-webhook-node';

import { logInfo, logError } from './watcher/Logger.js';
import { Watcher } from './watcher/Watcher.js';
import { WatcherPrice } from './watcher/WatcherPrice.js';
import { alertDiscord } from './notification/discordWebhook.js';
import { configurations } from '../config.js'
import { PriceDriver } from './PriceDriver.js';

const DEFAULT_REFRESH_INTERVAL = 60000
const DEFAULT_ALERT_THRESHOLD = 0.025

// logInfo("Config", configurations)

logInfo("ENV_TEST", process.env.ENV_TEST)

const sourceTypes = configurations.map(x => x.type).filter((v, i, a) => a.indexOf(v) === i)

logInfo("Sources", sourceTypes)

const pricePairs = new Map()

for (const source of sourceTypes)
{
    const set = configurations.filter(x => x.type === source).map(x => x.pair)
    pricePairs.set(source, configurations.filter(x => x.type === source).map(x => x.pair))
    logInfo("Pair", source, set)
}

/**
 * @param {string} key
 */
function buildcctxDriver(key)
{
    return new PriceDriver(
        /** @type {ccxt.Exchange} */(new ccxt[key]()),
        async (x) => await x.fetchTickers(pricePairs.get(key) ?? []),
        key
    );
}

/**
 * @param {string} key
 */
function buildYahooDriver(key)
{
    return new PriceDriver(
        yahooFinance,
        async (x) => await x.quote(pricePairs.get(key) ?? []),
        key
    );
}

const binanceDriver = buildcctxDriver("binance")
const huobiDriver = buildcctxDriver("huobi")
const ftxDriver = buildcctxDriver("ftx")
const yahooDriver = buildYahooDriver("yahoo")

/**
 * 
 * @param {ccxt.Dictionary<ccxt.Ticker>} target 
 * @param {string} pair 
 */
async function ccxtPrice(target, pair)
{
    const quote = target[pair]

    if (!quote)
    {
        throw "quote not found in cctx driver: " + pair
    }

    return {
        value: quote.last,
        currency: quote.symbol,
        timestamp: new Date(quote.timestamp),
        raw: quote.info
    }
}

/**
 * @param {string} pair 
 */
async function binancePrice(pair)
{
    return await ccxtPrice(await binanceDriver.retrieve(), pair)
}

/**
 * @param {string} pair 
 */
async function huobiPrice(pair)
{
    return await ccxtPrice(await huobiDriver.retrieve(), pair)
}

/**
 * @param {string} pair 
 */
async function ftxPrice(pair)
{
    return await ccxtPrice(await ftxDriver.retrieve(), pair)
}

/**
 * @param {string} query
 */
async function yahooPrice(query)
{
    const yahooQuotes = await yahooDriver.retrieve()
    const quote = yahooQuotes.find(x => x.symbol === query)

    if (!quote)
    {
        throw `yahooQuote: ${query} - not available`
    }

    const { regularMarketPrice, currency, regularMarketTime, exchange, displayName, shortName, sourceInterval, symbol } = quote;

    // logInfo("Quote", quote)

    return {
        value: regularMarketPrice,
        currency,
        timestamp: regularMarketTime,
        raw: {
            symbol,
            displayName,
            shortName,
            regularMarketPrice,
            currency,
            regularMarketTime,
            exchange,
            sourceInterval
        }
    }
}

async function priceDrivers()
{
    try
    {
        await Promise.all([
            binanceDriver.refresh(),
            huobiDriver.refresh(),
            yahooDriver.refresh(),
            ftxDriver.refresh()
        ])
    }
    catch (error)
    {
        logError("Price Driver", error)
    }
}

/**
 * @type {Watcher[]}
 */
const watchers = []

void (async () =>
{
    await priceDrivers()

    const yahooQuotes = await yahooDriver.retrieve()

    for (const config of configurations)
    {
        if (config.settings.notificationType === "discord")
        {
            if (!config.secrets.discord)
            {
                logError("Config Error", "Discord Webhook missing")
                process.exit(1)
            }
            const notification = new Webhook(config.secrets.discord)

            switch (config.type)
            {
                case "binance":
                    {
                        watchers.push(await new WatcherPrice(
                            config.pair,
                            async (context) => await alertDiscord(context, notification),
                            async () => await binancePrice(config.pair),
                            config.settings.threshold ?? DEFAULT_ALERT_THRESHOLD
                        ).init())
                    }
                    break

                case "huobi":
                    {
                        watchers.push(await new WatcherPrice(
                            config.pair,
                            async (context) => await alertDiscord(context, notification),
                            async () => await huobiPrice(config.pair),
                            config.settings.threshold ?? DEFAULT_ALERT_THRESHOLD
                        ).init())
                    }
                    break
                
                case "ftx":
                    {
                        watchers.push(await new WatcherPrice(
                            config.pair,
                            async (context) => await alertDiscord(context, notification),
                            async () => await ftxPrice(config.pair),
                            config.settings.threshold ?? DEFAULT_ALERT_THRESHOLD
                        ).init())
                    }
                    break

                case "yahoo":
                    {
                        const quote = yahooQuotes.find(x => x.symbol === config.pair)
                        const displayName = quote.displayName ?? quote.shortName ?? config.pair
                        watchers.push(await new WatcherPrice(
                            config.pair,
                            async (context) => await alertDiscord(context, notification, displayName),
                            async () => await yahooPrice(config.pair),
                            config.settings.threshold ?? DEFAULT_ALERT_THRESHOLD
                        ).init())
                    }
                    break

                default:
                    throw "unknown config type: " + config.type
            }
        }
        else
        {
            throw "Unknown notificationType: " + config.settings.notificationType
        }
    }

    setInterval(async () =>
    {
        // TODO: Turn off those opening in office hours
        await priceDrivers()
        for await (const watcher of watchers)
        {
            await watcher.refresh()
        }
    }, DEFAULT_REFRESH_INTERVAL)
})()

