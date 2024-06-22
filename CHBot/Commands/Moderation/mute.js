const { CommandInteraction, MessageEmbed } = require('discord.js');
const ms = require('ms');
const db = require('../../Structures/Schemas/MuteDB');

module.exports = {
    name: 'mute',
    description: 'Mute system.',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'member',
            description: 'Select a member.',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'Provide a reason.',
            type: 'STRING',
            required: true
        },
        {
            name: 'duration',
            description: 'Select a duration.',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: '30 Minutes',
                    value: '30m'
                },
                {
                    name: '1 Hour',
                    value: '1h'
                },
                {
                    name: '6 Hours',
                    value: '6h'
                },
                {
                    name: '24 Hours',
                    value: '24h'
                },
                {
                    name: '3 Days',
                    value: '3d'
                },
                {
                    name: '7 Days',
                    value: '7d'
                },
                {
                    name: '2 Weeks',
                    value: '14d'
                },
                {
                    name: '1 Month',
                    value: '29d'
                },
            ]
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { guild, user, options } = interaction;

        const Target = options.getUser('member');
        const Reason = options.getString('reason');
        const Duration = options.getString('duration');
        const Mute = guild.roles.cache.get('968568235496730624')

        const channel = client.channels.cache.find(c => c.id === '968568562484658227')

        const Response = new MessageEmbed()
        .setColor('PURPLE')
        .setAuthor('MUTE SYSTEM', guild.iconURL({dynamic: true}))

        //if(Target.id === user.id) {
            //Response.setDescription(`⛔ | You may not mute yourself.`)
            //return interaction.reply({ content: `${Target}`, embeds: [Response], ephemeral: true });
        //}

        db.findOne({ GuildID: guild.id, UserID: Target.id}, async (err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    GuildID: guild.id,
                    UserID: Target.id,
                    Content: [
                        {
                            ExecuterID: user.id,
                            ExecuterTag: user.tag,
                            TargetID: Target.id,
                            TargetTag: Target.tag,
                            Reason: Reason,
                            Duration: Duration,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const newMuteObject = {
                    ExecuterID: user.id,
                    ExecuterTag: user.tag,
                    TargetID: Target.id,
                    TargetTag: Target.tag,
                    Reason: Reason,
                    Duration: Duration,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.Content.push(newMuteObject)
            }
            data.save()
        })

        const Embed = new MessageEmbed()
        .setColor('PURPLE')
        .setTitle('**MUTE SYSTEM**')
        .setDescription(`Mute Initiated: ${Target.tag} | ||${Target.id}||\n**Reason:** ${Reason}\n**Duration:** ${Duration}`)

        Target.send({ content: `${Target}`, embeds: [Embed] }).catch(( ) => { console.log(`Could not send mute embed to target.`) })

        Embed.setDescription(`Mute Initiated: ${Target.tag} | ||${Target.id}||\n**Reason:** ${Reason}\n**Duration:** ${Duration}\n**Moderator:** ${user} | ||${user.id}||`)

        interaction.reply({ content: `${Target}`, embeds: [Embed], ephemeral: true })
        channel.send({ content: `${Target}`, embeds: [Embed], ephemeral: true })

        const newTarget = await guild.members.cache.get(Target.id)

        await newTarget.roles.add(Mute.id)
        setTimeout(async () => {
            if(!newTarget.roles.cache.has(Mute.id)) return;
            await newTarget.roles.remove(Mute.id)

            await db.findOneAndDelete({ GuildID: interaction.guildId, UserID: Target.id })
        }, ms(Duration))
    }
}