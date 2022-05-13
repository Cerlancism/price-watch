//@ts-check

import { Configuration } from './src/watcher/Configuration.js'

export const configurations = [
    new Configuration("BTC/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("ETH/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("LTC/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("XMR/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("DOGE/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("SC/USDT", "binance", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),

    new Configuration("XCH/USDT", "huobi", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),

    new Configuration("LUNA/USD", "ftx", { notificationType: "discord", threshold: 0.10 }, { discord: process.env.DISCORDWH_TEST }),

    new Configuration("C6L.SI", "yahoo", { notificationType: "discord", threshold: 0.05}, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("C07.SI", "yahoo", { notificationType: "discord", threshold: 0.05 }, { discord: process.env.DISCORDWH_GENERAL }),
    // Frasers
    // new Configuration("TQ5.SI", "yahoo", { notificationType: "discord", threshold: 0.05}, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("Y92.SI", "yahoo", { notificationType: "discord", threshold: 0.05 }, { discord: process.env.DISCORDWH_GENERAL }),
    // comfortdelgro 
    new Configuration("C52.SI", "yahoo", { notificationType: "discord", threshold: 0.05 }, { discord: process.env.DISCORDWH_GENERAL }),
    // OCBC
    new Configuration("O39.SI", "yahoo", { notificationType: "discord", threshold: 0.05 }, { discord: process.env.DISCORDWH_GENERAL }),

    // TSMC
    new Configuration("2330.TW", "yahoo", { notificationType: "discord", threshold: 0.025 }, { discord: process.env.DISCORDWH_TEST }),

    new Configuration("AMZN", "yahoo", { notificationType: "discord", threshold: 0.05 }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("AAPL", "yahoo", { notificationType: "discord", threshold: 0.05 }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("TSLA", "yahoo", { notificationType: "discord", threshold: 0.05}, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("TWTR", "yahoo", { notificationType: "discord", threshold: 0.05}, { discord: process.env.DISCORDWH_GENERAL }),
	new Configuration("FB", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
	new Configuration("GOOG", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("MRVL", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("NVDA", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("MSFT", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),

    // new Configuration("GC=F", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_GENERAL }),

    // new Configuration("BZ=F", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),
    // new Configuration("NG=F", "yahoo", { notificationType: "discord" }, { discord: process.env.DISCORDWH_TEST }),

    new Configuration("SGD=X", "yahoo", { notificationType: "discord", threshold: 0.01 }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("SGDMYR=X", "yahoo", { notificationType: "discord", threshold: 0.01 }, { discord: process.env.DISCORDWH_GENERAL }),
    new Configuration("SGDCNY=X", "yahoo", { notificationType: "discord", threshold: 0.01 }, { discord: process.env.DISCORDWH_TEST }),
    new Configuration("SGDJPY=X", "yahoo", { notificationType: "discord", threshold: 0.01 }, { discord: process.env.DISCORDWH_TEST }),
]
