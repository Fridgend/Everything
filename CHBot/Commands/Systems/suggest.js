const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'suggest',
    description: 'Full suggest system',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'type',
            description: 'The type of suggestion.',
            required: true,
            type: 'STRING',
            choices: [
                {
                    name: 'Command',
                    value: 'Command'
                },
                {
                    name: 'Event',
                    value: 'Event'
                },
                {
                    name: 'System',
                    value: 'System'
                }
            ]
        },
        {
            name: 'name',
            description: 'Provide a name for your suggestion.',
            required: true,
            type: 'STRING'
        },
        {
            name: 'functionality',
            description: 'Describe your suggestion',
            required: true,
            type: 'STRING'
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        const { options } = interaction

        const type = options.getString('type');
        const name = options.getString('name');
        const funcs = options.getString('functionality');

        const Response = new MessageEmbed()
        .setColor('PURPLE')
        .setDescription(`${interaction.member} has suggested a ${type}.`)
        .addField('Name', `${name}`)
        .addField('Functionality', `${funcs}`)

        const message = await interaction.reply({embeds: [Response], fetchReply: true})
        message.react(`🟢`)
        message.react(`🔴`)
    }
}