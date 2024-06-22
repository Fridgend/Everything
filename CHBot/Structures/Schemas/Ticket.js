const { model, Schema } = require('mongoose');

module.exports = model('Tickets', new Schema({
    GuildID: String,
    MembersID: String,
    TicketID: String,
    ChanneID: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String
}))