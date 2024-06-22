const { MessageEmbed, Client, CommandInteraction, Message } = require('discord.js');

module.exports = {
    name: 'modhelp',
    description: 'A small guide for moderators.',
    permission: 'ADMINISTRATOR',

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const { options, channel, user } = interaction;

        const Location = options.getString('location');

        const Embed = new MessageEmbed()
        .setTitle('**Moderation Help**')
        .setDescription('Being a moderator is hard sometimes, if you are in a situation where you dont quite know what to do, you can always try to use this command to your advantage.')
        .addFields(
            { name: 'Moderators', value: 'If you need help on a situation, you could alwawys contact another mod. Infact, whenever something comes up, you should always contact another mod.' },
            { name: 'How To Use', value: 'Below are 7 alternative ways of punishing members; Verbal Warning, Delete Message, Warning, Muting, Banning, Jailing, Reporting To Discord Trust & Safety. Below each punishment, there are a few numbers and letters with them. These numbers and letters represent a rule in <#968568409501622344>. For example, "G1" would represent "General Rule 1", "VC1" would represent "Voice Chat Rule 1", "PFP1" would represent "Profile Picture Rule 1". If you see a rule listed under "Warning", it means that in that scenario, a warning would be appropriate. Go ahead. Begin.' },
            { name: 'Verbal Warning (Very Mild)', value: `A verbal warning has no commands included at all. You simply tell the user to stop what they are doing and thats it.\n\n**G18**\n**G20**\n**G21**\n**VC3**\n**VC5**\n**PFP2**` },
            { name: 'Delete Message (Pretty Mild)', value: `Deleting a message from a member should almost always be first priority if possible. The punishment goes for basically all rule breaking in chats.` },
            { name: 'Warning (Mild)', value: `Warning a user with /warn (CHB) can be extremely useful to keep track of a member's doings. Warnings should be handed out to any member who breaks any of the rules, except for:\n\n**G18**\n**G20**\n**G21**\n**VC3**\n**VC5**\n**PFP2**` },
            { name: 'Mute (Alright)', value: `By simply using /mute (CHB) or /vcmute (CHB), a user will be unable to speak in either chat or vcs in just a few seconds. You can chose the duration, one day is usually good if you dont really know what you want.\n\n**G3**\n**G4**\n**G5**\n**G12**\n**G14**\n**G15**\n**G19**` },
            { name: 'Ban (Harsh)', value: `By using /ban (CHB), a user will be completely wiped from the server in a short moment. Bans are always permanent, so be careful with this one.\n\n**G7**\n**G8**\n**G9**\n**G14**\n**G16**\n**G17**\n**G19 - If Link Is Seriously Dangerous**\n**PFP1**` },
            { name: 'Jail (Harsh)', value: `Jailing a user can be very useful, pretty much like a ban except they are still in the server. /jail (CHB).\n\n**G6**\n**G10**\n**G12**\n**G13**\n**PFP3**` },
            { name: 'Reporting To Discord Trust & Safety (Very Harsh)', value: `If a user has done something unspeakable, you can report them to Discord Trust & Safety and try to get their account completely terminated from Discord, and making them unable to create a new one. If you are unsure if you should report someone to Discord, you could always check Discord Community Guidelines https://discord.com/guidelines. Here is the form for reporting a user: https://support.discord.com/hc/en-us/requests/ \n\n**G4**\n**G7**\n**G8**\n**G9**\n**G12**\n**G14**\n**G17**` }
        )
        .setColor('PURPLE')
        .setImage('https://cdn.discordapp.com/attachments/969608815093903360/1006535514733682718/Untitled_Artwork.png')
        .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
        .setFooter('If you have questions, contact Fridge.')
        .setTimestamp()

        interaction.reply({ content: `${user}`, embeds: [Embed], ephemeral: true })
    }
}