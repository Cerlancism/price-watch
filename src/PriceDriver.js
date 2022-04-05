//@ts-check
import { LocalStorage } from 'node-localstorage';
import { Loggable } from './watcher/Logger.js';

const localStorage = new LocalStorage("./storage")
/**
 * @template U
 * @template T
 */
export class PriceDriver extends Loggable
{
    /**
     * @param {U} provider
     * @param {(provider: U) => Promise<T>} getter
     * @param {string} key 
     */
    constructor(provider, getter, key)
    {
        super()
        this._provider = provider
        this._getter = getter
        this._key = key
    }

    get key()
    {
        return "price-driver-" + this._key + ".json"
    }

    /**
     * @returns {Promise<T>}
     */
    async retrieve()
    {
        const raw = localStorage.getItem(this.key)

        if (!raw)
        {
            throw "Cache missing: " + this.key
        }

        return JSON.parse(raw)
    }

    async refresh()
    {
        await this.getSave()
    }

    async getSave()
    {
        try
        {
            const source = await this._getter(this._provider)
            const raw = JSON.stringify(source, undefined, 2)
            localStorage.setItem(this.key, raw)
        }
        catch (error)
        {
            this.logError("PriceDriver", this._key, error)
        }
    }
}

