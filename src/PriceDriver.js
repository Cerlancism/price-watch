//@ts-check
import { Loggable } from './watcher/Logger.js';


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
        return this.value
    }

    async refresh()
    {
        await this.getSave()
    }

    async getSave()
    {
        try
        {
            this.value = await this._getter(this._provider)
        }
        catch (error)
        {
            this.logError("PriceDriver", this._key, error)
        }
    }
}

