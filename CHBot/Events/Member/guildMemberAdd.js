const { MessageEmbed, WebhookClient, GuildMember } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member 
     */

    execute(member) {
        const { user, guild } = member;


        member.roles.add('968568236738236486')
        member.roles.add('968568276441497600')
        member.roles.add('969242793786638337')
        member.roles.add('968568283697668206')
        member.roles.add('968568295148126258')
        member.roles.add('968568304237154324')
        member.roles.add('968568309685583904')
        member.roles.add('968568332884246609')
        member.roles.add('968568345827889182')
        member.roles.add('969855480061132831')
        

        //https://discord.com/api/webhooks/988372739616296960/GLQU7spRmLlq2umOFONAd6T6DxM7TAd4B2kTAmb2_Q4fifAp14DbJhyQ7CH2qDjnZgf1

        const Welcomer = new WebhookClient({
            id: '988372739616296960',
            token: 'GLQU7spRmLlq2umOFONAd6T6DxM7TAd4B2kTAmb2_Q4fifAp14DbJhyQ7CH2qDjnZgf1'
        })

        const Welcome = new MessageEmbed()
        .setColor('PURPLE')
        .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        Welcome ${member} to Chill Hangout! It's a pleasure to have you here!\nBelow are some channels to check out!\nNew Server Member Count: **${guild.memberCount}**`)
        .addFields(
            {
                name: `:scroll: Rules`,
                value: `<#968568409501622344>`,
                inline: true
            },
            {
                name: `:question: Information`,
                value: `<#968568407853248563>`,
                inline: true
            },
            {
                name: `:tada: Giveaways`,
                value: `<#969849144590086194>`,
                inline: true
            },
            {
                name: `:red_circle: Roles`,
                value: `<#968568459648720986>`,
                inline: true
            }
        )
        .setFooter(`User ID: ${user.id}`)

        Welcomer.send({embeds: [Welcome]})
    }
}