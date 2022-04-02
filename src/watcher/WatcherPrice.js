//@ts-check

import { EdgeValue } from "./EdgeValues.js";
import { Watcher } from "./Watcher.js";

const RETRY_TIMEOUT = 5000

export class WatcherPrice extends Watcher
{
    /**
     * @param {string} identity
     * @param {(context: WatcherPrice) => void} alertProvider
     * @param {() => Promise<{value: number; currency: string, timestamp: Date; raw: Object;}>} priceProvider
     * @param {number} threshold
     */
    constructor(identity, alertProvider, priceProvider, threshold)
    {
        super()

        if (typeof alertProvider !== "function")
        {
            throw "alertProvider is not a function"
        }

        if (typeof priceProvider !== "function")
        {
            throw "priceProvider is not a Promise"
        }

        this.currency = ""
        this.identity = identity
        this.sessionHigh = new EdgeValue()
        this.sessionLow = new EdgeValue()
        this.previous = new EdgeValue()
        this.current = new EdgeValue()
        this.raw = null
        this.threshold = threshold

        this._providers =
        {
            alert: alertProvider,
            price: priceProvider
        }
    }

    async init()
    {
        try
        {
            const latest = await this._providers.price()
            this.currency = latest.currency
            this.logInfo("Init", this.identity.padEnd(10, " "), `${latest.value.toLocaleString("en", { maximumFractionDigits: 4, minimumFractionDigits: 4 })}`.padStart(12, " "), this.currency)
            this.resetAll(latest.value)
            return this
        }
        catch (error)
        {
            this.logError("Init Failure", this.identity, error)
            await this.sleep(RETRY_TIMEOUT)
            this.logError("Init Retry", this.identity)
            return this.init()
        }
    }

    /**
     * @override
     */
    async update()
    {
        const latest = await this._providers.price()
        this.current.update(latest.value, latest.timestamp)
        this.raw = latest.raw
    }

    /**
     * @override
     */
    checkAlert()
    {
        const value = this.current.value
        const diff = value / this.previous.value
        this.logInfo("Check", this.identity.padEnd(10, " "), value.toFixed(8).padStart(16, " "), this.currency.padEnd(10, " "), `${diff.toLocaleString("en", { style: "percent", maximumFractionDigits: 2, minimumFractionDigits: 2 })}`.padEnd(7, " "), this.current.timestamp.toLocaleString())

        if (Math.abs(1 - diff) >= this.threshold)
        {
            return true
        }
        else
        {
            if (value > this.sessionHigh.value)
            {
                this.sessionHigh.update(value)
                this.logInfo("Session Highest 🟢", this.identity, this.sessionHigh.value)
            }
            else if (value < this.sessionLow.value)
            {
                this.sessionLow.update(value)
                this.logInfo("Session Lowest  🔴", this.identity, this.sessionLow.value)
            }
        }

        return false
    }

    /**
     * @override
     */
    alert()
    {
        this._providers.alert(this)
        this.resetAll(this.current.value, this.current.timestamp)
    }

    /**
     * @param {number} value 
     */
    resetAll(value, timestamp = new Date())
    {
        this.current.update(value, timestamp)
        this.previous.update(value, timestamp)
        this.sessionHigh.update(value, timestamp)
        this.sessionLow.update(value, timestamp)
    }

    /**
     * @override
     * @param {string} subtag
     * @param {any[]} args
     */
    logInfo(subtag, ...args)
    {
        super.logInfo(`WatcherPrice - ${subtag}`, ...args)
    }

    /**
     * @override
     * @param {string} subtag
     * @param {any[]} args
     */
    logError(subtag, ...args)
    {
        super.logInfo(`WatcherPrice - ${subtag}`, ...args)
    }
}
