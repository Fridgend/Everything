const { Schema, model } = require('mongoose')

module.exports = model('MuteDB', new Schema({
    GuildID: String,
    UserID: String,
    Content: Array
}))