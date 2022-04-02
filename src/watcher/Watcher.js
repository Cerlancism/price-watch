//@ts-check
import { Loggable } from './Logger.js'

/**
 * @abstract
 */
export class Watcher extends Loggable
{
    constructor()
    {
        super()
    }

    async refresh()
    {
        try
        {
            await this.update()

            if (this.checkAlert())
            {
                this.alert()
            }
        }
        catch (error)
        {
            this.logError("Watcher Base", "Update Error", error)
        }
    }

    /**
     * @param {number} timeout
     */
    async sleep(timeout)
    {
        return new Promise(resolve =>
        {
            setTimeout(() => resolve(), timeout)
        })
    }

    /**
     * @abstract
     * @returns {Promise<void>}
     */
    async update()
    {
        throw "update Not Implemented"
    }

    /**
     * @abstract
     * @returns {boolean}
     */
    checkAlert()
    {
        throw "checkAlert Not Implemented"
    }

    /**
    * @abstract
    * @returns {void}
    */
    alert()
    {
        throw "alert Not Implemented"
    }
}

