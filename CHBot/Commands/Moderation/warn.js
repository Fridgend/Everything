const { CommandInteraction, Client, MessageEmbed } = require('discord.js')
const db = require('../../Structures/Schemas/WarningDB');

module.exports = {
    name: 'warn',
    description: 'Full warn system.',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'add',
            description: 'Adds a warning to a user.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a user.',
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
                    name: 'evidence',
                    description: 'Provide evidence.',
                    type: 'STRING',
                    required: false
                },
            ]
        },
        {
            name: 'remove',
            description: 'Removes a warning from a user.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a user.',
                    type: 'USER',
                    required: true
                },
                {
                    name: 'warnid',
                    description: 'Provide the warning id.',
                    type: 'NUMBER',
                    required: true
                },
            ]
        },
        {
            name: 'clear',
            description: 'Clears all warnings from a user.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a user.',
                    type: 'USER',
                    required: true
                },
            ]
        },
        {
            name: 'check',
            description: 'Checks user warnings.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a user.',
                    type: 'USER',
                    required: true
                },
            ]
        }
    ],

    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction 
     */

    execute(interaction, client, arguments) {

        const { options } = interaction;

        const Sub = options.getSubcommand();
        const Target = options.getUser('target');
        const Reason = options.getString('reason');
        const Evidence = options.getString('evidence') || 'None Provided.'
        const WarnID = options.getNumber('warnid') - 1;
        const WarnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        const channel = client.channels.cache.find(c => c.id === '968568562484658227')

        switch (Sub) {
            case 'add' : {
                db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.tag }, async (err, data) => {
                    if(err) throw err;
                    if(!data) {
                        data = new db({
                            GuildID: interaction.guildId,
                            UserID: Target.id,
                            UserTag: Target.tag,
                            Content: [
                                {
                                    ExecuterID: interaction.user.id,
                                    ExecuterTag: interaction.user.tag,
                                    Reason: Reason,
                                    Evidence: Evidence,
                                    Date: WarnDate
                                }
                            ],
                        })
                    } else {
                        const obj = {
                            ExecuterID: interaction.user.id,
                            ExecuterTag: interaction.user.tag,
                            Reason: Reason,
                            Evidence: Evidence,
                            Date: WarnDate
                        }
                        data.Content.push(obj)
                    }
                    data.save()
                });

                const Embed = new MessageEmbed()
                .setTitle('WARNING SYSTEM')
                .setColor('PURPLE')
                .setDescription(`Warning Added: ${Target.tag} | ||${Target.id}||\n**Reason:** ${Reason}\n**Evidence:** ${Evidence}`)

                interaction.reply({ content: `${Target}`, embeds: [Embed], ephemeral: true })
                Target.send({ content: `${Target}`, embeds: [Embed] })
                channel.send({ content: `${Target}`, embeds: [Embed] })



            } 
            break;
            
            case 'check' : {
            db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.tag }, async (err, data) => {
                if(err) throw err;
                if(data) {
                    interaction.reply({embeds: [new MessageEmbed()
                    .setTitle('WARNING SYSTEM')
                    .setColor('PURPLE')
                    .setDescription(`${data.Content.map(
                        (w, i) => `**ID**: ${i + 1}\n**By**: ${w.ExecuterTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}\n**Evidence**: ${w.Evidence}
                        \n`
                    ).join(' ')}`)], ephemeral: true});
                } else {
                    interaction.reply({embeds: [new MessageEmbed()
                    .setTitle('WARNING SYSTEM')
                    .setColor('PURPLE')
                    .setDescription(`${Target.tag} | ||${Target.id}|| has no warnings.`)], ephemeral: true})
                }
            });

            } 
            break;
            
            case 'remove' : {
            db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.tag }, async(err, data) => {
                if(err) throw err;
                if(data) {

                    data.Content.splice(WarnID, 1)

                    const Embed = new MessageEmbed()
                    .setTitle('WARNING SYSTEM')
                    .setColor('PURPLE')
                    .setDescription(`${Target.tag}'s warning id: ${WarnID + 1} has been removed.`)

                    interaction.reply({ content: `${Target}`, embeds: [Embed], ephemeral: true })
                    Target.send({ content: `${Target}`, embeds: [Embed] })
                    channel.send({ content: `${Target}`, embeds: [Embed] })

                    data.save()
                } else {
                    interaction.reply({embeds: [new MessageEmbed()
                    .setTitle('WARNING SYSTEM')
                    .setColor('PURPLE')
                    .setDescription(`${Target.tag} | ||${Target.id}|| has no warnings.`)], ephemeral: true})
                }
            })

            } 
            break;
            
            case 'clear' : {
                db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.tag }, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        await db.findOneAndDelete({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.tag })

                        const Embed = new MessageEmbed()
                        .setTitle('WARNING SYSTEM')
                        .setColor('PURPLE')
                        .setDescription(`${Target.tag}'s warnings were cleared. | ||${Target.id}||`)

                        interaction.reply({ content: `${Target}`, embeds: [Embed], ephemeral: true })
                        Target.send({ content: `${Target}`, embeds: [Embed] })
                        channel.send({ content: `${Target}`, embeds: [Embed] })
                    } else {
                        interaction.reply({embeds: [new MessageEmbed()
                        .setTitle('WARNING SYSTEM')
                        .setColor('PURPLE')
                        .setDescription(`${Target.tag} | ||${Target.id}|| has no warnings.`)], ephemeral: true})
                    }
                })
            }
            break;
        }
    }
}