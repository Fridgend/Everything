const { 
    MessageEmbed, 
    CommandInteraction,
    MessageActionRow,
    MessageButton, 
    Message
} = require('discord.js')
const { OPENTICKET } = require('../../Structures/config.json')

module.exports = {
    name: 'ticketsetup',
    description: 'Setup Ticket Message',
    permission: 'ADMINISTRATOR',

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        const { guild } = interaction;

        const Embed = new MessageEmbed()
            .setAuthor(
                guild.name + " | Ticketing System",
                guild.iconURL({ dynamic: true })
            )
            .setDescription(
                "Open a ticket to discuss any of the issues listed on the button."
            )
            .setColor('PURPLE')

        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
                .setCustomId('player')
                .setLabel('User Report')
                .setStyle('DANGER')
                .setEmoji(`👤`),

            new MessageButton()
                .setCustomId('staff')
                .setLabel('Staff Report')
                .setStyle('DANGER')
                .setEmoji(`🚓`),
            
            new MessageButton()
                .setCustomId('bug')
                .setLabel('Bug Report')
                .setStyle('DANGER')
                .setEmoji('🐛'),

            new MessageButton()
                .setCustomId('ads')
                .setLabel('DM Advertising Report')
                .setStyle('DANGER')
                .setEmoji('💬'),

            new MessageButton()
                .setCustomId('other')
                .setLabel('Other Report')
                .setStyle('DANGER')
                .setEmoji(`⚠`)
        );

        await guild.channels.cache.get(OPENTICKET).send({ embeds: [Embed], components: [Buttons] })
        interaction.reply({ content: 'Success', ephemeral: true })
    }
}