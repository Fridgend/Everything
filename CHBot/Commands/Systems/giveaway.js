const { CommandInteraction, MessageEmbed, Client, Message } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'giveaway',
    description: 'Giveaway System',
    permission: 'MENTION_EVERYONE',
    options: [
        {
            name: 'start',
            description: 'Start a giveaway',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'duration',
                    description: 'Provide Duration (1m, 1h, 1d)',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'winners',
                    description: 'Provide The Amount of Winners',
                    type: 'INTEGER',
                    required: true
                },
                {
                    name: 'prize',
                    description: 'Provide a Prize For The Giveaway',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'channel',
                    description: 'Provide a Channel To Send The Giveaway To',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT']
                }
            ]
        },
        {
            name: 'actions',
            description: 'Options For a Running Giveaway',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'options',
                    description: 'Select an Option',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'end',
                            value: 'end'
                        },
                        {
                            name: 'pause',
                            value: 'pause'
                        },
                        {
                            name: 'unpause',
                            value: 'unpause'
                        },
                        {
                            name: 'reroll',
                            value: 'reroll'
                        },
                        {
                            name: 'delete',
                            value: 'delete'
                        },
                    ]
                },
                {
                    name: 'messageid',
                    description: 'Provide the message id of the giveaway',
                    type: 'STRING',
                    required: true
                }
            ]
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    execute(interaction, client) {
        const { options } = interaction;
        const Sub = options.getSubcommand();

        const errorEmbed = new MessageEmbed()
        .setColor('RED');

        const successEmbed = new MessageEmbed()
        .setColor('GREEN');

        switch (Sub) {
            case 'start' : {

                const gchannel = options.getChannel('channel') || interaction.channel;
                const duration = options.getString('duration');
                const winnerCount = options.getInteger('winners');
                const prize = options.getString('prize');

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    messages: {
                        giveaway: `🎉 **Giveaway Started** 🎉`,
                        giveawayEnd: `✨ **Giveaway Ended** ✨`,
                        winMessage: `🎊 *GG!* **{winners}, you've won {this.prize}!** *GG!* 🎊`
                    }
                }).then((gData) => {
                    successEmbed.setDescription('Giveaway Started Successfully.');
                    interaction.reply({ embeds: [successEmbed] });
                }).catch((err) => {
                    errorEmbed.setDescription(`An Error Occured \n\`${err}\``);
                    interaction.reply({ embeds: [errorEmbed] });
                })





            }
            break;

            case 'actions' : {
                const choice = options.getString('options');
                const messageId = options.getString('messageid')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId)

                if(!giveaway) {
                    errorEmbed.setDescription(`Unable to find the giveaway with the message ID`);
                    interaction.reply({ embeds: [errorEmbed] })
                }

                switch (choice) {
                    case 'end' : {
                        client.giveawaysManager.end(messageId).then(() => {
                            successEmbed.setDescription(`Successfully Ended The Giveaway`)
                            return interaction.reply({ embeds: [successEmbed] })
                        })
                        .catch((err) => {
                            errorEmbed.setDescription(`An Error Occurred\n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed] })
                        });
                    }
                    break;

                    case 'pause' : {
                        client.giveawaysManager.pause(messageId).then(() => {
                            successEmbed.setDescription(`Successfully Paused The Giveaway`)
                            return interaction.reply({ embeds: [successEmbed] })
                        })
                        .catch((err) => {
                            errorEmbed.setDescription(`An Error Occurred\n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed] })
                        });
                    }
                    break;

                    case 'unpause' : {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            successEmbed.setDescription(`Successfully Unpaused The Giveaway`)
                            return interaction.reply({ embeds: [successEmbed] })
                        })
                        .catch((err) => {
                            errorEmbed.setDescription(`An Error Occurred\n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed] })
                        });
                    }
                    break;

                    case 'reroll' : {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            successEmbed.setDescription(`Successfully Rerolled The Giveaway`)
                            return interaction.reply({ embeds: [successEmbed] })
                        })
                        .catch((err) => {
                            errorEmbed.setDescription(`An Error Occurred\n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed] })
                        });
                    }
                    break;

                    case 'delete' : {
                        client.giveawaysManager.delete(messageId).then(() => {
                            successEmbed.setDescription(`Successfully Deleted The Giveaway`)
                            return interaction.reply({ embeds: [successEmbed] })
                        })
                        .catch((err) => {
                            errorEmbed.setDescription(`An Error Occurred\n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed] })
                        });
                    }
                    break;
                }
            }
            break;

            default : {
                console.log('Error with Giveaway')
            }
        }
    }
}