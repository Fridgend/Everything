const { MessageEmbed, WebhookClient, GuildMember } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',

    /**
     * 
     * @param {GuildMember} member 
     */

    execute(member) {
        const { user, guild } = member;

        const Welcomer = new WebhookClient({
            id: '990572794444132392',
            token: 'NqW5BrwjutZEctFUpG72RrHgq0DlHG0LWKCJ3LNhu3FUaqXPXuTDyrLWL9hFj--pFyBQ'
        })

        const Welcome = new MessageEmbed()
        .setColor('PURPLE')
        .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        Goodbye ${member}...\nIt was nice having you here!\nNew Server Member Count: **${guild.memberCount}**`)
        .setFooter(`User ID: ${user.id}`)

        Welcomer.send({embeds: [Welcome]})
    }
}