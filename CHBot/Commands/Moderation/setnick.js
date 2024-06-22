const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: 'setnick',
    description: 'Set the nickname of a user.',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'Select a user.',
            required: true
        },
        {
            name: 'nickname',
            type: 'STRING',
            description: 'Choose a nickname for the user.',
            required: false
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { options, guild, user } = interaction;

        const channel = client.channels.cache.find(c => c.id === '968568562484658227')

        const User = options.getMember('user');
        const Nickname = options.getString('nickname') || '';

        if(!User.manageable) {
            return interaction.reply({ content: 'I can not execute the command on that person as they are an Administrator.', ephemeral: true })
        }
 
        const Embed = new MessageEmbed()
        .setTitle('Edited Nickname')
        .setDescription(`${User}'s nickname has been moderated.\n**Old:** ${User.displayName}\n**New:** ${Nickname} *if this text is all you see, it means the nickname was reset*\n**Moderator:** ${user}`)
        .setColor('PURPLE')
        .setTimestamp()

        interaction.reply({ content: `${User}`, embeds: [ Embed ], ephemeral: true })
        User.user.send({ content: `${User}`, embeds: [ Embed ] })
        channel.send({ content: `${User}`, embeds: [ Embed ] })


        await User.setNickname(`${Nickname}`)
    }
}