//@ts-check
import { MessageBuilder, Webhook } from 'discord-webhook-node'
import { WatcherPrice } from '../watcher/WatcherPrice.js'

/**
 * @param {WatcherPrice} context 
 * @param {Webhook} notification
 * @param {string} name
 */
export async function alertDiscord(context, notification, name = context.identity)
{
    const riseFall = context.current.value > context.previous.value
    const against = riseFall ? context.sessionLow : context.sessionHigh
    const percent = `${(context.current.value / against.value - 1).toLocaleString("en", { style: "percent", maximumFractionDigits: 2 })}`
    context.logInfo("Notification", context.identity, name, context.previous, context.current, against, percent)

    notification.setUsername(name + " Price")

    const text = (riseFall ? "🟢" : "🔴")
        + ` ${percent}`
        + ` \`${against.value.toFixed(8)}\` -> \`${context.current.value.toFixed(8)}\` \`${context.currency}\``

    const embed = new MessageBuilder()
        .setText(text)
        .setTitle("Raw")
        .setDescription("```json\n" + JSON.stringify(context.raw, undefined, 2) + "\n```")
    
    // if (!context.previous.init)
    // {
    //     embed.setFooter("Last Edge")
    // }
    // else
    // {
    //     embed.setFooter("Checker was Restarted")
    // }

    embed.setFooter("Last Edge")
    // @ts-ignore
    embed.setTimestamp(against.timestamp)

    await notification.send(embed)
}