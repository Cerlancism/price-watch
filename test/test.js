//@ts-check
import yahooFinance from 'yahoo-finance2';
import ccxt from 'ccxt'

import { Webhook } from 'discord-webhook-node';

import { logInfo, logError, Loggable } from '../src/watcher/Logger.js';
import { Watcher } from '../src/watcher/Watcher.js';
import { WatcherPrice } from '../src/watcher/WatcherPrice.js';
import { alertDiscord } from '../src/notification/discordWebhook.js';

import { configurations } from '../config.js'

import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage("./storage")

logInfo("Config", configurations)

const REFRESH_INTERVAL = 60000

void (async () =>
{
    const sourceTypes = configurations.map(x => x.type).filter((v, i, a) => a.indexOf(v) === i)


    // console.log(await yahooFinance.quote("GC=F"))

    console.log(await yahooFinance.quoteSummary("APPL"))
})()

