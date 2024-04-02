const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Set the rich presence for the bot
  client.user.setPresence({
    activities: [{
      name: 'with fire', // The message shown in the rich presence
      type: ActivityType.Playing // The type of activity
    }],
    status: 'online' // The bot's status
  });
});

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
