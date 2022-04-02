//@ts-check
import yahooFinance from 'yahoo-finance2';
import ccxt from 'ccxt'

import { Webhook } from 'discord-webhook-node';

import { logInfo, logError } from '../src/watcher/Logger.js';
import { Watcher } from '../src/watcher/Watcher.js';
import { WatcherPrice } from '../src/watcher/WatcherPrice.js';
import { alertDiscord } from '../src/notification/discordWebhook.js';
import { configurations } from '../config.js'

logInfo("Config", configurations)

const REFRESH_INTERVAL = 60000

const huobi = new ccxt.huobi()

void (async () =>
{
    const ticker = await huobi.fetchTicker("XCH/USDT")

    console.log(ticker)
})()

