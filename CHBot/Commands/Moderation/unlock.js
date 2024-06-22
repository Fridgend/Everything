const { MessageEmbed, CommandInteraction, Client } = require('discord.js');
const DB = require('../../Structures/Schemas/LockDown');

module.exports = {
    name: 'unlock',
    description: 'Unlock a channel.',
    permission: 'ADMINISTRATOR',

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */

    async execute(interaction, client) {
        const { guild, channel, user } = interaction;

        const MemberRole = guild.roles.cache.find(r => r.id === '968568294049185802');
        const Logs = client.channels.cache.find(c => c.id === '968568562484658227');

        const Embed = new MessageEmbed();

        if(channel.permissionsFor(MemberRole.id).has('SEND_MESSAGES')){
            return interaction.reply({
            content: `${user}`,
            embeds: [
                Embed.setColor('RED').setDescription(
                    `⛔ | **This channel is not locked.**`
                )
            ],
            ephemeral: true
        });}

        channel.permissionOverwrites.edit(MemberRole.id, {
            SEND_MESSAGES: null
        })

        await DB.deleteOne({ ChannelID: channel.id });

        interaction.reply({
            embeds: [
                Embed.setColor('PURPLE').setDescription(
                    `🔓 | ${channel} unlocked by ${user}.`
                )
            ]
        })

        Logs.send({
            embeds: [
                Embed.setColor('PURPLE').setDescription(
                    `🔓 | ${channel} unlocked by ${user}.`
                )
            ]
        })
    }
}