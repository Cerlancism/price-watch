export class Configuration
{
    /**
     * @param {string} pair 
     * @param {string} type
     * @param {{[key in string]: string}} settings 
     * @param {{[key in string]: string}} secrets 
     */
    constructor(pair, type, settings, secrets)
    {
        this.pair = pair
        this.type = type
        this.settings = settings
        this.secrets = secrets
    }
}
