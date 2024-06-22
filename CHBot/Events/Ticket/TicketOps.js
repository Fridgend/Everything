const { ButtonInteraction, MessageEmbed } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const { TRANSCRIPTSID } = require('../../Structures/config.json');
const DB = require('../../Structures/Schemas/Ticket');
const { create } = require('../../Structures/Schemas/Ticket');

module.exports = {
    name: 'interactionCreate',

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) {
        if(!interaction.isButton()) return;
        const { guild, customId, channel, member } = interaction;

        if(!member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'You may not use these buttons.'});
        if(!['close', 'lock', 'unlock'].includes(customId)) return;

        const Embed = new MessageEmbed().setColor('PURPLE')

        DB.findOne({ ChanneID: channel.id }, async(err, docs) => {
            if(err) throw err;
            if(!docs)
                return interaction.reply({
                    content: 'No data found. Please delete manual.',
                    ephemeral: true,
                });
            switch(customId) {
                case 'lock' :
                if(docs.Locked == true)
                    return interaction.reply({
                        content: 'The ticket is already locked.',
                        ephemeral: true,
                    });
                await DB.updateOne({ ChanneID: channel.id }, { Locked: true });
                Embed.setDescription('🔒 | This ticket has been locked for reviewing.');
                channel.permissionOverwrites.edit(docs.MembersID, {
                    SEND_MESSAGES: false,
                });
                interaction.reply({ embeds: [Embed] });
                break;

                case 'unlock' :
                if(docs.Locked == false)
                    return interaction.reply({
                        content: 'The ticket is already unlocked.',
                        ephemeral: true,
                    });
                await DB.updateOne({ ChanneID: channel.id }, { Locked: false });
                Embed.setDescription('🔓 | This ticket has been unlocked.');
                channel.permissionOverwrites.edit(docs.MembersID, {
                    SEND_MESSAGES: true,
                });
                interaction.reply({ embeds: [Embed] });
                break;

                case 'close' :
                    if(docs.Closed == true)
                    return interaction.reply({
                        content: 'Ticket is already closed, please wait for deletion.',
                        ephemeral: true,
                    });
                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${docs.Type} - ${docs.TicketID}.html`,
                    });
                    await DB.updateOne({ ChanneID: channel.id }, { Closed: true });

                    const Message = await guild.channels.cache.get(TRANSCRIPTSID).send({
                        embeds: [
                            Embed.setTitle(`Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`),
                        ],
                        files: [attachment],
                    });

                    interaction.reply({
                        embeds: [
                            Embed.setDescription(
                                `The transcript has been saved [TRANSCRIPT](${Message.url})`
                            )
                        ]
                    });

                    setTimeout(() => {
                        channel.delete();
                    }, 10 * 1000);
            }
        })
    }
}