const { Client } = require('discord.js')
const mongoose = require('mongoose')
const { Database } = require('../../Structures/config.json')

/**
 * @param {Client} client
 */

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('The Client Is Ready.')
        client.user.setActivity('everyone', {type: 'LISTENING'})

        require('../../Systems/LockdownSys')(client);

        if(!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Database connected.')
        }).catch((err) => {
            console.log(err)
        });
    }
}