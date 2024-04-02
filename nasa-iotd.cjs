const { Client, GatewayIntentBits, MessageAttachment } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Necessary for receiving message content
  ]
});

client.on('messageCreate', async message => {
  if (message.content.toLowerCase() === 'image') {
    // Dynamically import the fetch function from the node-fetch module
    const { default: fetch } = await import('node-fetch');

    // Fetch the image of the day from NASA's API
    const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=YOUR_NASA_API_KEY'; // Replace with your actual NASA API key
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.url;

    // Check if the media type is an image and not a video
    if (data.media_type === 'image') {
      // Create an attachment and send the image
      const attachment = new MessageAttachment(imageUrl);
      message.channel.send({ files: [attachment] });
    } else {
      // If the media type is not an image, send a message to inform the user
      message.channel.send('The NASA Picture of the Day is not an image today. Please check back tomorrow!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN); // Replace with your Discord bot token
