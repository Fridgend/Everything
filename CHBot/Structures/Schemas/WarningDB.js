const { Schema, model } = require('mongoose')

module.exports = model('WarningDB', new Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array
}))