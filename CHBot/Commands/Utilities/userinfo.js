const { ContextMenuInteraction, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'userinfo',
    type: 'USER',
    permission: 'ADMINISTRATOR',
    context: true,

    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */

    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId)

        const Response = new MessageEmbed()
        .setColor('PURPLE')
        .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
        .addField('ID:', `${target.user.id}`, true)
        .addField('Roles:', `${target.roles.cache.map(r => r).join(' ').replace('@everyone', ' ') || 'None'}`)
        .addField('Member Since:', `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
        .addField('Discord User Since:', `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)

        interaction.reply({embeds: [Response], ephemeral: true})
    }
}