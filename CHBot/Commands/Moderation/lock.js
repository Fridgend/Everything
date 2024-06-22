const { MessageEmbed, CommandInteraction } = require('discord.js');
const DB = require('../../Structures/Schemas/LockDown');
const ms = require('ms');

module.exports = {
    name: 'lock',
    description: 'Lock the channel this command is sent in.',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'time',
            description: 'Expire date for lockdown (ex. 1m, 1h, 1d)',
            type: 'STRING'
        },
        {
            name: 'reason',
            description: 'Why are you locking this channel down?',
            type: 'STRING'
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { guild, channel, options, user } = interaction;
        const Reason = options.getString('reason') || 'No reason provided.';

        const MemberRole = guild.roles.cache.find(r => r.id === '968568294049185802');
        const Logs = client.channels.cache.find(c => c.id === '968568562484658227');

        const Embed = new MessageEmbed();

        if(!channel.permissionsFor(MemberRole.id).has('SEND_MESSAGES'))
        return interaction.reply({ 
            content: `${user}`,
            embeds: [
                Embed.setColor('RED').setDescription(
                    `⛔ | **This channel is already locked.**`
                )
            ],
            ephemeral: true 
        })

        channel.permissionOverwrites.edit(MemberRole.id, {
            SEND_MESSAGES: false,
        })

        interaction.reply({
            embeds: [
                Embed.setColor('PURPLE').setDescription(
                    `🔒 | ${channel} locked for ${Reason} by ${user}.`
                )
            ] 
        })

        Logs.send({
            embeds: [
                Embed.setColor('PURPLE').setDescription(
                    `🔒 | ${channel} locked for ${Reason} by ${user}.`
                )
            ]
        })

        const Time = options.getString('time');
        if (Time) {
            const ExpireDate = Date.now() + ms(Time)
            DB.create({ GuildID: guild.id, ChannelID: channel.id, Time: ExpireDate })

            setTimeout(async () => {
                channel.permissionOverwrites.edit(MemberRole.id, {
                    SEND_MESSAGES: null,
                })
                interaction.editReply({
                    embeds: [
                        Embed.setColor('PURPLE').setDescription(
                            `🔓 | ${channel} has been unlocked.`
                        )
                    ]
                }).catch(() => {})
                Logs.send({
                    embeds: [
                        Embed.setColor('PURPLE').setDescription(
                            `🔓 | ${channel} has been unlocked.`
                        )
                    ]
                })
                await DB.deleteOne({ ChannelID: channel.id })
            }, ms(Time));
        }
    }
}