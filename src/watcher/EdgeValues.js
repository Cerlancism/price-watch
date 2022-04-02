//@ts-check

export class EdgeValue
{
    /**
     * @param {number} [init]
     */
    constructor(init, timestamp = new Date())
    {
        if (init)
        {
            this.update(init, timestamp)
        }
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
    }
}


