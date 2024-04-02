const {
  Client,
  GatewayIntentBits,
  ActivityType,
  AttachmentBuilder,
} = require("discord.js");

// Define the intents required for your bot
const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.MessageContent, // Add this intent to access message content
];

// Create a new client instance with the specified intents
const client = new Client({ intents });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set the rich presence for the bot
  client.user.setPresence({
    activities: [
      {
        name: "causing chaos",
        type: ActivityType.Custom,
        assets: {
          large_image: "embedded_background",
          large_text: "chillin",
          small_image: "embedded_cover",
          small_text: "listening to spotify",
        },
      },
    ],
    status: "online",
  });
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "image") {
    // Dynamically import the fetch function from the node-fetch module
    const { default: fetch } = await import("node-fetch");

    // Fetch the image of the day from NASA's API
    const apiUrl =
      "https://api.nasa.gov/planetary/apod?api_key=lzBaQJHm8F905xQF8JfpzciR43yJHldCvpep1a95"; // Replace with your actual NASA API key
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.url;

    // Check if the media type is an image and not a video
    if (data.media_type === "image") {
      // Create an attachment and send the image
      const attachment = new AttachmentBuilder(imageUrl);
      message.channel.send({ files: [attachment] });
    } else {
      // If the media type is not an image, send a message to inform the user
      message.channel.send(
        "The NASA Picture of the Day is not an image today. Please check back tomorrow!"
      );
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.content.toLowerCase() === "party") {
    message.reply("ALVIN");
  }
});

const randomMessages = ["Hello, world!", "I am a bot!", "How are you today?"];

let messageCount = 0;
const MESSAGE_THRESHOLD = 5;

client.on("message", (msg) => {
  // Increment message count for each user message
  if (!msg.author.bot) {
    messageCount++;
  }
  
  client.on('message', msg => {
  if (!msg.author.bot) {
    messageCount++;
    console.log(`Message count is now: ${messageCount}`); // Log the message count
  }


  // When message count reaches the threshold, send a random message and reset the counter
  if (messageCount >= MESSAGE_THRESHOLD) {
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    msg.channel.send(randomMessages[randomIndex]);
    messageCount = 0; // Reset the counter
  }
});

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
