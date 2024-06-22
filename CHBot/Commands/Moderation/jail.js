const { CommandInteraction, Client, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'jail',
  description: 'Jails the specified user',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'user',
      description: 'The user to jail.',
      required: true,
      type: 'USER'
    },
    {
      name: 'reason',
      description: 'The reason for jailing the user.',
      required: true,
      type: 'STRING'
    },
  ],
  execute(CommandInteraction, Client) {

    const channel = Client.channels.cache.find(c => c.id === '968568562484658227')

    const memberToJailID = CommandInteraction.options.getUser('user').id
    const memberToJail = CommandInteraction.guild.members.cache.get(`${memberToJailID}`)
    const memberRole = CommandInteraction.guild.roles.cache.find(r => r.name === '🔑│Member')
    const jailRole = CommandInteraction.guild.roles.cache.find(r => r.name === 'Jailed')

    if(memberToJail.roles.cache.find(role => role.name === 'Jailed')) return CommandInteraction.reply('The member is already jailed.');

    memberToJail.roles.remove(memberRole)
    memberToJail.roles.add(jailRole)

    const embed = new MessageEmbed()
      .setTitle('⛓ Jailed User ⛓')
      .setDescription(`Successfully jailed member.\n \n**Jailed User:** ${memberToJail.user.username}\n**Moderator: **${CommandInteraction.user.username}\n**Reason: **${CommandInteraction.options.getString('reason')}`)
      .setColor('RED')
      .setTimestamp()

    CommandInteraction.reply({ content: memberToJail, embeds: [embed], ephemeral: true })
    memberToJail.send({ content: memberToJail, embeds: [embed] })
    channel.send({ content: memberToJail, embeds: [embed] })
  }
}