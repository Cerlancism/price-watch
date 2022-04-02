//@ts-check
import { MessageBuilder, Webhook } from 'discord-webhook-node'
import { WatcherPrice } from '../watcher/WatcherPrice.js'

/**
 * @param {WatcherPrice} context 
 * @param {Webhook} notification
 */
export async function alertDiscord(context, notification)
{
    const percent = `${(context.current.value / context.previous.value - 1).toLocaleString("en", { style: "percent", maximumFractionDigits: 2 })}`
    context.logInfo("Notification", context.identity, context.previous, context.current, percent)

    notification.setUsername(context.identity + " Price")

    const text = (context.current.value > context.previous.value ? "🟢" : "🔴")
        + ` ${percent}`
        + ` \`${context.previous.value.toFixed(8)}\` -> \`${context.current.value.toFixed(8)}\` \`${context.currency}\``

    const embed = new MessageBuilder()
        .setText(text)
        .setTitle("Raw")
        .setDescription("```json\n" + JSON.stringify(context.raw, undefined, 2) + "\n```")
        .setFooter("Last Edge")
        // @ts-ignore
        .setTimestamp(context.previous.timestamp)

    await notification.send(embed)
}