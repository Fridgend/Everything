const { CommandInteraction, Client, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'unjail',
  description: 'Unjails the specified user',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'user',
      description: 'The user to unjail.',
      required: true,
      type: 'USER'
    },
    {
      name: 'reason',
      description: 'The reason for unjailing the user.',
      required: true,
      type: 'STRING'
    },
  ],
  execute(CommandInteraction, Client) {

    const channel = Client.channels.cache.find(c => c.id === '968568562484658227')

    const memberToUnjailID = CommandInteraction.options.getUser('user').id
    const memberToUnjail = CommandInteraction.guild.members.cache.get(`${memberToUnjailID}`)
    const memberRole = CommandInteraction.guild.roles.cache.find(r => r.name === '🔑│Member')
    const jailRole = CommandInteraction.guild.roles.cache.find(r => r.name === 'Jailed')

    if(!memberToUnjail.roles.cache.find(role => role.name === 'Jailed')) return CommandInteraction.reply('The member is not jailed.');

    memberToUnjail.roles.add(memberRole)
    memberToUnjail.roles.remove(jailRole)

    CommandInteraction.reply('**Successfully unjailed the user.**')

    const embed = new MessageEmbed()
      .setTitle('⛓ Unjailed User ⛓')
      .setDescription(`Successfully unjailed member.\n \n**Unailed User:** ${memberToUnjail.user.username}\n**Moderator: **${CommandInteraction.user.username}\n**Reason: **${CommandInteraction.options.getString('reason')}`)
      .setColor('GREEN')
      .setTimestamp()

    channel.send({ embeds: [embed] })
  }
}