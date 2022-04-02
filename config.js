import { Configuration } from './src/watcher/Configuration.js'

export const configurations = [
    new Configuration("BTC/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("ETH/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("LTC/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("XMR/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("DOGE/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("SC/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),

    new Configuration("XCH/USDT", "huobi", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),

    new Configuration("C6L.SI", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("C07.SI", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("NVDA", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("2330.TW", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("MRVL", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),
]
