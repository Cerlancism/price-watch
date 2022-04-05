//@ts-check

import { LocalStorage } from "node-localstorage"
import { Loggable } from "./Logger.js"

const localStorage = new LocalStorage("./storage")

export class EdgeValue extends Loggable
{
    /**
     * @param {string} identity
     * @param {"current" | "previous" | "high" | "low"} type
     * @param {() => ({value: number, timestamp: Date})} initialiser 
     */
    constructor(identity, type, initialiser)
    {
        super()

        this._identity = identity
        this.type = type

        const raw = localStorage.getItem(this.key)

        if (!raw)
        {
            const init = initialiser()
            this.logInfo("EdgeValue - New", init)
            this.update(init.value, init.timestamp)
        }
        else
        {
            const retrived = JSON.parse(raw)
            this.logInfo("EdgeValue - Revive", retrived)
            this.update(retrived.value, retrived.timestamp)
        }
    }

    get key()
    {
        return `edge-value-${this._identity}-${this.type}.json`
    }

    /**
     * 
     * @param {number} value 
     * @param {Date} timestamp
     */
    update(value, timestamp = new Date())
    {
        this.value = value
        this.timestamp = timestamp

        localStorage.setItem(this.key, JSON.stringify(this))
    }
}


