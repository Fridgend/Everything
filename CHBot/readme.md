# CHBot
This is a discord bot that I designed a few years back with the help of some popular YouTube tutorials. It started out as just me trying to learn the discord bot API using these tutorials, but as I became more confident, more and more of this project became my own work.
The discord bot was made for a discord server that is no longer active. It was made mainly to make the life of moderators easier, but also had a few features designed for the community.

## Challenges:
- I remember I wanted to add a logging system to the bot, one that would tell you when a user joined or left, or when a channel name was updated, or when a user's roles were updated. This was when I started getting more comfortable with the API, and I think this was one of the first big things I implemented on my own. I wanted it to be able to detect the different events in the server. I remember, however, that implementing the system for detecting changes in roles and permissions was a living hell. I remember staying up super late just reading through the Discord API documentation, desperately looking for what I was doing wrong. I don't fully remember what it was but eventually I got it working perfectly. After that, I swore to never change those lines of code. 

## Improvements for the future:
- It was a while ago since CHBot was running, but I remember testing its functionalities and finding that one of the commands had actually stopped working, being the /clear command used to remove a certain number of messages from a channel. I think the /ban command also doesn't work properly since one of it's options (being to clear recent messages from the user to be banned), had also stopped working. I'm guessing Discord made some changes to how those things work, and so if I were to pick this project up again sometime, I'd work on that.

### Written in...
This project is written entirely in JavaScript (more specifically Node.js).