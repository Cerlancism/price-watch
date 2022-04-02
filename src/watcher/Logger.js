//@ts-check

/**
 * 
 * @param {(...args: any[]) => void} out 
 */
function buildLogger(out)
{
    /**
     * @param {string} tag
     * @param {any[]} args
     */
    function logger(tag, ...args)
    {
        out(new Date().toLocaleString(), `[${tag}]`, ...args)
    }

    return logger
}

export const logInfo = buildLogger(console.log)
export const logError = buildLogger(console.error)

export class Loggable
{
    /**
     * @param {string} tag
     * @param {any[]} args
     */
    logInfo(tag, ...args)
    {
        logInfo(tag, ...args)
    }

    /**
     * @param {string} tag
     * @param {any[]} args
     */
    logError(tag, ...args)
    {
        logError(tag, ...args)
    }
}
