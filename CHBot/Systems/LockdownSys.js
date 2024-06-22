const { Client } = require('discord.js')
const DB = require('../Structures/Schemas/LockDown');

/**
 * @param {Client} client
 */

module.exports = async(client) => {
    DB.find().then(async (documentsArray) => {
        documentsArray.forEach(async (d) => {
            const Channel = client.guilds.cache.get(d.GuildID).channels.cache.get(d.ChannelID)
            const MemberRole = client.guilds.cache.get(d.GuildID).roles.cache.find(r => r.id === '968568294049185802');

            if(!Channel) return;

            const TimeNow = Date.now()
            if(d.Time < TimeNow) {
                Channel.permissionOverwrites.edit(MemberRole.id, {
                    SEND_MESSAGES: null,
                })
                return await DB.deleteOne({ ChannelID: Channel.id })
            }

            const ExpireDate = d.Time - Date.now();

            setTimeout(async () => {
                Channel.permissionOverwrites.edit(MemberRole.id, {
                    SEND_MESSAGES: null,
                })

                await DB.deleteOne({ ChannelID: Channel.id })
            }, ExpireDate)
        })
    })
}