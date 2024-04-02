const { Client, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client();

client.on('message', async message => {
  if (message.content.toLowerCase() === 'image') {
    // Fetch the image of the day from NASA's API
    const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=lzBaQJHm8F905xQF8JfpzciR43yJHldCvpep1a95'; // Replace with your actual NASA API key
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.url;

    // Check if the media type is an image and not a video
    if(data.media_type === 'image') {
      // Create an attachment and send the image
      const attachment = new MessageAttachment(imageUrl);
      message.channel.send(attachment);
    } else {
      // If the media type is not an image, send a message to inform the user
      message.channel.send('The NASA Picture of the Day is not an image today. Please check back tomorrow!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN); // Replace with your Discord bot token
