import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});


const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY"; // Replace with your Pexels API key

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "random") {
    const query = options.getString("query"); // Make sure 'query' is the correct name of your option

    // Fetch a random photo from Pexels using the user's query
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const pexelsData = await pexelsResponse.json();
    const imageUrl = pexelsData.photos[0].src.original;

    // Create an embed with the image
    const imageEmbed = new MessageEmbed()
      .setTitle(`Random Image for "${query}"`)
      .setImage(imageUrl);

    // Reply to the interaction with the embed
    await interaction.reply({ embeds: [imageEmbed] });
  }
});

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
