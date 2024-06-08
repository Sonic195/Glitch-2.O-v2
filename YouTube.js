import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
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
  EmbedBuilder,
} from "discord.js";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
  flipper,
} from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";
import mongoose from "mongoose";
import { testEmbed, ytEmbed } from "./embed.js";

const userId = `get/users/{user.id}`;
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options, type, member, user } = data;

    if (name === "youtube") {
      
      const ytEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("YouTube")
            .setURL("https://www.youtube.com/")
            .setAuthor({
              name: "Glitch 2.O",
              icon_URL: "https://cdn.glitch.global/735481a2-904c-41de-b19a-67260bbf38b2/IMG_0527.jpeg?v=1717832468897",
            })
            .setDescription("go get some popcorn")
            .setThumbnail("https://cdn.glitch.global/735481a2-904c-41de-b19a-67260bbf38b2/IMG_0527.jpeg?v=1717832468897")
            .addFields({
              name: "Amount of Glitchos left",
              value: "working on it",
            })
            .setTimestamp()
            .setFooter({
              text: "just chillin",
              iconURL: "https://i.imgur.com/AfFp7pu.png",
            });
      
      const row = {
            type: 1, // Type 1 is for ACTION_ROW
            components: [
              {
                type: 4, // Type 2 is for text input
                title: "what to watch...",
                custom_id: "search",
                label: "search",
                style: 1, // Style 1 is for PRIMARY
              },
            ],
          };
      
      const query = options[0].value;
      const videoIndex = 0;
      let videoData = [];

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
          )}&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`, // Use the YouTube API key from the environment variable
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        const data = await response.json();
        if (data && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          const videoTitle = data.items[0].snippet.title;
          const videoThumbnailUrl = data.items[0].snippet.thumbnails.high.url;

          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `https://www.youtube.com/watch?v=${videoId}`,

              components: [row],
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "No videos found for your query.",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching from YouTube API:", error);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "An error occurred while fetching videos.",
          },
        });
      }
    }
  }
});
