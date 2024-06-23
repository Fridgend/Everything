# CHBot
This is a discord bot that I designed a few years back with the help of some popular YouTube tutorials. It started out as just me trying to learn the discord bot API using these tutorials, but as I became more confident, more and more of this project became my own work.
The discord bot was made for a discord server that is no longer active. It was made mainly to make the life of moderators easier, but also had a few features designed for the community. 

**NOTE:** This is an older version of the bot, the newest version is gone because of something that happened rather recently. I'll refer to this later on as "The Incident". It's a long story, but I'll try to summarize:
At some point, my Raspberry Pi (where the newest version was stored) ran into some fatal error that forced me to factory reset the device. I was able to upload a few things to my Google Drive before that, but the CHBot folder was too big. Seeing as it was no longer online anyway, I just ignored it and began the factory reset.

## Challenges:
- I remember I wanted to add a logging system to the bot, one that would tell you when a user joined or left, or when a channel name was updated, or when a user's roles were updated. This was when I started getting more comfortable with the API, and I think this was one of the first big things I implemented on my own. I wanted it to be able to detect the different events in the server. I remember, however, that implementing the system for detecting changes in roles and permissions was a living hell. I remember staying up super late just reading through the Discord API documentation, desperately looking for what I was doing wrong. I don't fully remember what it was but eventually I got it working perfectly. After that, I swore to never change those lines of code. Unfortunately, this functionality is not included in this older version, althought it's probably for the better since those lines of code were probably pretty ugly.. 

## Improvements for the future:
- It was a while ago since CHBot was running, but I remember testing its functionalities and finding that one of the commands had actually stopped working, being the /clear command used to remove a certain number of messages from a channel. I think the /ban command also doesn't work properly since one of it's options (being to clear recent messages from the user to be banned), had also stopped working. I'm guessing Discord made some changes to how those things work, so if I were to pick this project up again sometime, I'd work on that.

## What I learned:
- From working on CHBot, I developed a deep understanding of the Discord API and how to use it to implement certain features.
- I also became more confident in JavaScript and Node.js, since it was still quite new to me at the time.
- I also now know how to use the scp command in command prompt to transfer files to different devices rather than to Google Drive. If only I knew of it before The Incident...

### Written in...
This project is written entirely in JavaScript (more specifically Node.js).
