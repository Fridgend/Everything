const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'clear',
  description: 'Deletes the specified number of messages from a channel or specific user.',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'amount',
      description: 'The amount of messages to delete',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'user',
      description: 'The person whos messages should be deleted.',
      type: 'USER',
      required: false
    }
  ],

  async execute(CommandInteraction) {
    const { channel, options } = CommandInteraction
    const amount = options.getNumber('amount')
    const user = options.getUser('user')

    const Messages = await channel.messages.fetch()

    const response = new MessageEmbed()
    .setColor('PURPLE')

    if(user) {
      let i = 0;
      const filtered = [];

      (await Messages).filter((m) => {
        if(m.author.id === user.id && amount > i) {
          filtered.push(m);
          i++;
        }
      })

      await channel.bulkDelete(filtered, true).then(messages => {
        response.setDescription(`Cleared **${messages.size} messages** from ${user}`)
        CommandInteraction.reply({ embeds: [response], ephemeral: true })
      })
    } else {
      await channel.bulkDelete(amount, true).then(messages => {
        response.setDescription(`Cleared **${messages.size} messages** from the channel.`)
        CommandInteraction.reply({ embeds: [response], ephemeral: true })
      })
    }
  }
}