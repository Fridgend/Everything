const { MessageEmbed, ButtonInteraction, Client, PermissionsBitField, GuildMemberManager } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        if(!interaction.isButton()) return;

        const { guild, customId, member } = interaction;

        const MemberRole = guild.roles.cache.find(r => r.id === '968568294049185802')
        const MainChat = client.channels.cache.find(c => c.id === '968568427868463146');
        const Logs = client.channels.cache.find(c => c.id === '968568562484658227');

        const channel1 = client.channels.cache.find(c => c.id === '968568424953421894');
        const channel2 = client.channels.cache.find(c => c.id === '993526452832182333');
        const channel3 = client.channels.cache.find(c => c.id === '968568459648720986');
        const channel4 = client.channels.cache.find(c => c.id === '997223893041422429');
        const channel5 = client.channels.cache.find(c => c.id === '968568480750264340');
        const channel6 = client.channels.cache.find(c => c.id === '996299379147276290');
        const channel7 = client.channels.cache.find(c => c.id === '996299801593380964');
        const channel8 = client.channels.cache.find(c => c.id === '999917224678653962');
        const channel9 = client.channels.cache.find(c => c.id === '968568503038787704');

        if(!member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'You may not use these buttons.'});
        if(!['yes', 'yes2', 'no', 'no2'].includes(customId)) return;

        const Embed = new MessageEmbed()

        const perms = MemberRole.permissions.toArray();

        console.log(perms)

        switch(customId) {
            case 'yes' : {
                const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES')
                await MemberRole.edit({ permissions: newPerms })

                channel1.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel2.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel3.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel4.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel5.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel6.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel7.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel8.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                channel9.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: false
                })

                Embed.setAuthor(`🛑 LOCKDOWN SYSTEM 🛑`).setTitle(`⛔ **FULL SERVER LOCKDOWN INITIATED** ⛔`).setDescription("THE `MEMBER` ROLE'S PERMISSIONS HAVE BEEN REMOVED. TALKING IN THE SERVER AT ALL IS IMPOSSIBLE.")

                interaction.reply({ embeds: [Embed], ephemeral: true })
                MainChat.send({ embeds: [Embed] })
                Logs.send({ embeds: [Embed] })
            }
            break;

            case 'no' : {
                interaction.reply({ content: `**Action cancelled**`, ephemeral: true })
            }
            break;

            case 'yes2' : {
                perms.push('SEND_MESSAGES')
                await MemberRole.edit({ permissions: perms })

                channel1.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel2.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel3.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel4.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel5.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel6.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel7.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel8.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                channel9.permissionOverwrites.edit(MemberRole.id, {
                    VIEW_CHANNEL: true
                })

                Embed.setAuthor(`🛑 LOCKDOWN SYSTEM 🛑`).setTitle(`⛔ **FULL SERVER LOCKDOWN COMPLETE** ⛔`).setDescription("THE `MEMBER` ROLE'S PERMISSIONS HAVE BEEN RESET. TALKING IN THE SERVER IS NOW POSSIBLE.")

                interaction.reply({ embeds: [Embed], ephemeral: true })
                MainChat.send({ embeds: [Embed] })
                Logs.send({ embeds: [Embed] })
            }
            break;

            case 'no2' : {
                interaction.reply({ content: `**Action cancelled.**`, ephemeral: true })
            }
            break;
        }
    }
}