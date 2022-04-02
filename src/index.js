//@ts-check
import yahooFinance from 'yahoo-finance2';
import ccxt from 'ccxt'

import { Webhook } from 'discord-webhook-node';

import { logInfo, logError } from './watcher/Logger.js';
import { Watcher } from './watcher/Watcher.js';
import { WatcherPrice } from './watcher/WatcherPrice.js';
import { alertDiscord } from './notification/discordWebhook.js';
import { configurations } from '../config.js'

// logInfo("Config", configurations)

logInfo("ENV_TEST", process.env.ENV_TEST)

const binancePairs = configurations.filter(x => x.type === "binance").map(x => x.pair)
const huobiPairs = configurations.filter(x => x.type === "huobi").map(x => x.pair)
const yahooQueries = configurations.filter(x => x.type === "yahoo").map(x => x.pair)

logInfo("binancePairs", binancePairs)
logInfo("huobiPairs", huobiPairs)
logInfo("yahooQueries", yahooQueries)

const REFRESH_INTERVAL = 60000
const ALERT_THRESHOLD = 0.025

const binance = new ccxt.binance()
/**
 * @type {ccxt.Dictionary<ccxt.Ticker>}
 */
let binanceQuotes = {}

const huobi = new ccxt.huobi()
/**
 * @type {ccxt.Dictionary<ccxt.Ticker>}
 */
let huobiQuotes = {}

/**
 * @type {import('yahoo-finance2/dist/esm/src/modules/quote').Quote[]}
 */
let yahooQuotes = []

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
    return await ccxtPrice(binanceQuotes, pair)
}

/**
 * @param {string} pair 
 */
async function huobiPrice(pair)
{
    return await ccxtPrice(huobiQuotes, pair)
}



/**
 * @param {string} query
 */
async function yahooPrice(query)
{
    const quote = yahooQuotes.find(x => x.symbol === query)
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
        binanceQuotes = await binance.fetchTickers(binancePairs)
        huobiQuotes = await huobi.fetchTickers(huobiPairs)
        yahooQuotes = await yahooFinance.quote(yahooQueries)

        // logInfo("yahooQuotes", yahooQuotes)
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
                            ALERT_THRESHOLD
                        ).init())
                    }
                    break

                case "huobi":
                    {
                        watchers.push(await new WatcherPrice(
                            config.pair,
                            async (context) => await alertDiscord(context, notification),
                            async () => await huobiPrice(config.pair),
                            ALERT_THRESHOLD
                        ).init())
                    }
                    break

                case "yahoo":
                    {
                        watchers.push(await new WatcherPrice(
                            yahooQuotes.find(x => x.symbol === config.pair).displayName ?? yahooQuotes.find(x => x.symbol === config.pair).shortName ?? config.pair,
                            async (context) => await alertDiscord(context, notification),
                            async () => await yahooPrice(config.pair),
                            ALERT_THRESHOLD
                        ).init())
                    }
                    break

                default:
                    throw "unknown config type: " + config.type
            }
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
    }, REFRESH_INTERVAL)
})()
