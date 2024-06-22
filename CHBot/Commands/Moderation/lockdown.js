const { MessageEmbed, Client, CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'lockdown',
    description: 'Disables chatting in the entire server',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'toggle',
            description: 'False: Disable Lockdown; True: Enable Lockdown',
            type: 'BOOLEAN',
            required: true
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { user, options } = interaction;

        const Toggle = options.getBoolean('toggle')

        switch(Toggle) {
            case true : {
                const Response = new MessageEmbed()
                .setTitle(`⛔ **WARNING** ⛔`)
                .setAuthor(`🛑 LOCKDOWN SYSTEM 🛑`)
                .setDescription('Are you confident you would like to perform this command? Doing so will preclude all members besides moderators from connecting to any voice channel, and chatting in any text channel. The misusage of this command will result in a immediate demotion and ban from the server.')
                .setColor('RED')

                const Buttons = new MessageActionRow()
                Buttons.addComponents(
                    new MessageButton()
                    .setCustomId('yes')
                    .setLabel('Continue')
                    .setStyle('DANGER')
                    .setEmoji(`✅`),

                    new MessageButton()
                    .setCustomId('no')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
                    .setEmoji(`❌`)
                )

                interaction.reply({ content: `${user}`, embeds: [Response], components: [Buttons], ephemeral: true })
            }
            break;

            case false : {
                const Response = new MessageEmbed()
                .setTitle(`⛔ **WARNING** ⛔`)
                .setAuthor(`🛑 LOCKDOWN SYSTEM 🛑`)
                .setDescription('Are you confident you would like to perform this command? Doing so will allow all members to connect to any voice channel, and chatting in any text channel. The misusage of this command will result in a immediate demotion and ban from the server.')
                .setColor('RED')

                const Buttons = new MessageActionRow()
                Buttons.addComponents(
                    new MessageButton()
                    .setCustomId('yes2')
                    .setLabel('Continue')
                    .setStyle('DANGER')
                    .setEmoji(`✅`),

                    new MessageButton()
                    .setCustomId('no2')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
                    .setEmoji(`❌`)
                )

                interaction.reply({ content: `${user}`, embeds: [Response], components: [Buttons], ephemeral: true })
            }
            break;
        }
    }
}