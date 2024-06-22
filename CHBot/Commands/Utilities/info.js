const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Get some information about a topic.',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'topic',
            description: 'Which topic would you like to know more of?',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'Server', value: 'server' },
                { name: 'Level Roles', value: 'level' },
                { name: 'Booster Perks', value: 'booster' },
                { name: 'Voter Perks', value: 'voter' }
            ]
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { channel, options, user } = interaction;

        const topic = options.getString('topic')

        switch(topic) {
            case 'server' : {
                const Embed = new MessageEmbed()
                .setDescription(`Chill Hangout is a discord server where people can make new friends or just chat with others. We want to gather people from all over the globe to join us. Chill Hangout was created on the 26th of April in 2022.\n\nWe try to host events where everyone can join and participate, we try to create an engaging community, and we try our absolute best to make sure you enjoy you stay <3`)
                .setColor('PURPLE')
                .setTimestamp()

                interaction.reply({ content: `${user}`, embeds: [ Embed ], ephemeral: true})
            }
            break;

            case 'level' : {
                const Embed = new MessageEmbed()
                .setAuthor('Level Roles!')
                .setTitle('**LEVEL ROLE REWARDS!!**')
                .addFields(
                    {
                        name: "`Level 1+`",
                        value: `➥ <@969243287737208862>\n✓ *Hoisted Role!*\n✓ *Use external emojis (with nitro)*\n✓ *Use external stickers (with nitro)*`,
                        inline: true
                    },
                    {
                        name: "`Level 5`",
                        value: `➥ <@969243389822369802>\n✓ *Everything in Level 1+!*\n✓ *Change your server nickname!*\n✓ *Access to a few applications!*`,
                        inline: true
                    },
                    {
                        name: "`Level 10`",
                        value: `➥ <@969243453642899487>\n✓ *Everything in Level 5!*\n✓ *Send messages in threads!*\n✓ *Embed links!*\n✓ *Attach files!*\n✓ *Access to all applications!*`,
                        inline: true
                    },
                    {
                        name: "`Level 15`",
                        value: `➥ <@969243507728482324>\n✓ *Everything in Level 10!*\n✓ *Create threads!*`,
                        inline: true
                    },
                    {
                        name: "`Level 25`",
                        value: `➥ <@969243687878000701>\n✓ *Everything in Level 15!*\n✓ *Add reactions!*`,
                        inline: true
                    },
                    {
                        name: "`Level 30+`",
                        value: `➥ <@969243616109264916>\n✓ *Nothing...*\n*but you'll be one of few!*`,
                        inline: true
                    }
                )
                .setFooter('Have fun! -Fridge')
                .setTimestamp()

                interaction.reply({ content: `${user}`, embeds: [ Embed ], ephemeral: true})
            }
            break;

            case 'booster' : {
                const Embed = new MessageEmbed()
                .setAuthor('Booster Perks!')
                .setTitle('**BOOSTER PERKS!!**')
                .addFields(
                    {
                        name: "`Boosters`",
                        value: `<@968925017989611540>\nBoosters are very special people in Chill Hangout, they truly help us out and allow us to do so much more. They allow us to reach our full potential!\nFor 5$/month, boosters get the following perks in our server:\n\n✓ *A Hoisted Role To Appear Above Everyone Else*\n✓ *All Of The Level Role Perks Combined*\n✓ *A Custom Emoji Of Their Choice*\n✓ *A Custom Role Of Their Choice*\n*✓ Booster-Exclusive Channels*\n*✓ Full Access To Both Self-Promotion Channels*\n*✓ Priority In Tickets/Support*\n*✓ Friend Request From Fridge*\n\nThank you boosters, you truly are the reason this server can reach it's full potential.`
                    }
                )
                .setFooter('Thank you. -Fridge')
                .setTimestamp()

                interaction.reply({ content: `${user}`, embeds: [ Embed ], ephemeral: true})
            }
            break;

            case 'voter' : {
                const Embed = new MessageEmbed()
                .setAuthor('Voter Perks!')
                .setTitle('**VOTER PERKS!!**')
                .addFields(
                    {
                        name: "`Voters`",
                        value: `<@969644922976210944>\nVoters are members of Chill Hangout who really want to support us and help us grow. When a member votes for our server, it shows other users of Discord that Chill Hangout might be a server worth checking out, therefore, we thank all of the members of Chill Hangout who vote for us :)`
                    }
                )
                .setFooter('Thank you. -Fridge')
                .setTimestamp()

                interaction.reply({ content: `${user}`, embeds: [ Embed ], ephemeral: true})
            }
            break;
        }
    }
}