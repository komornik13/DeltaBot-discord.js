require('dotenv').config()

const { Client, IntentsBitField, ActivityType } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ]
})
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI, { keepAlive: true })

  .then(() => {
    
    console.log('Connected to DB.');
   

  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
  });
eventHandler(client);


let status = [
    {
        name: '📜 Moderation',
        type: ActivityType.Watching,
        url: "https://discord.com/api/oauth2/authorize?client_id=1132396823114436759&permissions=8&scope=bot"
    },
    {
        name: '🔒 Safety',
        type: ActivityType.Watching,
        url: "https://discord.com/api/oauth2/authorize?client_id=1132396823114436759&permissions=8&scope=bot",
    },
    {
        name: '🎉 Fun',
        type: ActivityType.Watching,
        url: "https://discord.com/api/oauth2/authorize?client_id=1132396823114436759&permissions=8&scope=bot",
    },
];

let currentIndex = 0;

client.on('ready', () => {
    //console.log(`✅ ${client.user.username + ' | ' + client.user.id} is online`);

    setInterval(() => {
        client.user.setActivity(status[currentIndex]);
        currentIndex = (currentIndex + 1) % status.length;
    }, 7000);
});








client.login(process.env.TOKEN)