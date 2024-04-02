const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

// Define the intents required for your bot
const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.GuildMessageTyping,
];

// Create a new client instance with the specified intents
const client = new Client({ intents });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set the rich presence for the bot
  client.user.setPresence({
    activities: [{
      name: 'spotify', 
      type: ActivityType.Streaming,
      url: ""
      assets: {
        large_image: 'embedded_background',
        large_text: 'chillin',
        small_image: 'embedded_cover',
        small_text: 'listening to spotify',
      }
    }],
    status: 'online' 
  });
});

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
