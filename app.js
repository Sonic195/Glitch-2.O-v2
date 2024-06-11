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

// Placeholder for an in-memory storage
// In a real application, you would use a database
const streaks = {};

// Function to get the current streak for a user
function getStreak(userId) {
  // Return the streak for the user if it exists, otherwise return 0
  return streaks[userId] || 0;
}

// Function to set the streak for a user
function setStreak(userId, streak) {
  // Set the streak for the user
  streaks[userId] = streak;
}

const userId = `get/users/{user.id}`;
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

mongoose
  .connect(
    "mongodb+srv://shadownite:Shad0wn1t3195@glitch2o.tqkm8rw.mongodb.net/"
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("DB error:", error);
    process.exit(1);
  });

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

const userRewardSchema = new mongoose.Schema({
  userId: String,
  glitches: Number,
  ytTokens: Number,
  lastClaimed: Date,
});

const UserReward = mongoose.model("UserReward", userRewardSchema);

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
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

    if (name === "text") {
      // Send a modal as response
      return res.send({
        type: InteractionResponseType.APPLICATION_MODAL,
        data: {
          custom_id: "my_modal",
          title: "Modal title",
          components: [
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: "my_text",
                  style: 1,
                  label: "Type some text",
                },
              ],
            },
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: "my_longer_text",
                  // Bigger text box for input
                  style: 2,
                  label: "Type some (longer) text",
                },
              ],
            },
          ],
        },
      });
    }

    if (name === "reg") {
      const userId = member.user.id;
      const user = await UserReward.findOne({ userId });
      if (!user) {
        await UserReward.create({
          userId,
          glitches: 100,
          ytTokens: 5,
          lastClaimed: new Date(),
        });
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Registered as ${userId}`,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "User already registered",
          },
        });
      }
    }

    if (name === "daily") {
      const userId = member.user.id;
      const user = await UserReward.findOne({ userId });
      if (!user) {
        await UserReward.create({
          userId,
          lastClaimed: new Date(),
        });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        date: {
          content: "working on it",
        },
      });
    }

    if (name === "pinger") {
      const startTime = Date.now();
      const latency = Date.now() - startTime;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `latency: ${latency}ms`,
        },
      });
    }
    if (name === "youtube") {

      return res.send({
        type: InteractionResponseType.APPLICATION_MODAL,
        data: {
          custom_id: 'youtube_modal',
          title: 'Search',
          embeds: [ytEmbed],
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  custom_id: 'search',
                  style: 1,
                  label: "Search...",
                },
              ],
            },
          ],
        },
      });
    }

    if (name === "ping") {
      // Send the initial message with a button
      const row = {
        type: 1, // Type 1 is for ACTION_ROW
        components: [
          {
            type: 2, // Type 2 is for BUTTON
            custom_id: "ping_pong_button",
            label: "Ping 🏓",
            style: 1, // Style 1 is for PRIMARY
          },
        ],
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Pong!",
          components: [row],
        },
      });
    }

    if (name === "gifify") {
      const query = options[0].value;
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${
            process.env.GIPHY_API_KEY
          }&q=${encodeURIComponent(query)}&limit=1`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data && data.data.length > 0) {
          const gifUrl = data.data[0].images.original.url;
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: gifUrl,
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "No GIFs found for your query.",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching from GIPHY API:", error);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "An error occurred while fetching GIFs.",
          },
        });
      }
    }

    // "test" command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "Hello, world! " + getRandomEmoji(),
          embeds: [testEmbed],
        },
      });
    }

    if (name === "image-of-the-day") {
      try {
        const response = await fetch(
          "https://api.nasa.gov/planetary/apod?api_key=lzBaQJHm8F905xQF8JfpzciR43yJHldCvpep1a95"
        );
        const data = await response.json();
        if (data && data.url) {
          const imageUrl = data.url;
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: imageUrl,
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "There is no image today.",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching from NASA API:", error);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "An error occurred while fetching the image.",
          },
        });
      }
    }

    if (name === "water-bucket-clutch") {
      // lander
      function lander() {
        const land = ["failed", "failed", "failed", "got a lucky clutch"];
        return land[Math.floor(Math.random() * land.length)];
      }
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `you ${lander()}`,
        },
      });
    }
    if (name === "coinflip") {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: flipper() + " wins",
          ephemeral: false,
        },
      });
    }

    if (name === "challenge" && id) {
      const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      // Create active game using message ID as the game ID
      activeGames[id] = {
        id: userId,
        objectName,
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Rock papers scissors challenge from <@${userId}>`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${req.body.id}`,
                  label: "Accept",
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    if (componentId.startsWith("search")) {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      const query = endpoint.values[0];
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
          const url = `https://www.youtube.com/watch?v=${videoId}`;

          return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: `https://www.youtube.com/watch?v=${videoId}`,
              components: endpoint.components, // Keep the original components
            },
          });
        }
      } catch (error) {
        console.error("Error fetching from youtube:", error);
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: "An error occurred while fetching the image.",
          },
        });
      }
    }

    if (componentId.startsWith("ping_pong_button")) {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      const pingPong = ["ping", "ping", "miss"];
      const result = pingPong[Math.floor(Math.random() * pingPong.length)];
      let streaks = 0;

      if (result === "ping") {
        let currentStreak = getStreak(userId); // Get the current streak for the user
        currentStreak++; // Increment the streak
        setStreak(userId, currentStreak); // Update the streak for the user

        // Edit the original message to update the streak count
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `Pong 🏓\nStreak: ${currentStreak}`,
            components: endpoint.components, // Keep the original components
          },
        });
      } else {
        setStreak(userId, 0); // Reset the streak for the user

        // Edit the original message to reset the streak count
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `missed\nStreak has been reset.`,
            components: endpoint.components, // Keep the original components
          },
        });
      }
    }

    if (componentId.startsWith("accept_button_")) {
      // get the associated game ID
      const gameId = componentId.replace("accept_button_", "");
      // Delete message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      try {
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "What is your object of choice?",
            // Indicates it'll be an ephemeral message
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.STRING_SELECT,
                    // Append game ID
                    custom_id: `select_choice_${gameId}`,
                    options: getShuffledOptions(),
                  },
                ],
              },
            ],
          },
        });
        // Delete previous message
        await DiscordRequest(endpoint, { method: "DELETE" });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    } else if (componentId.startsWith("select_choice_")) {
      // get the associated game ID
      const gameId = componentId.replace("select_choice_", "");

      if (activeGames[gameId]) {
        // Get user ID and object choice for responding user
        const userId = req.body.member.user.id;
        const objectName = data.values[0];
        // Calculate result from helper function
        const resultStr = getResult(activeGames[gameId], {
          id: userId,
          objectName,
        });

        // Remove game from storage
        delete activeGames[gameId];
        // Update message with token in request body
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

        try {
          // Send results
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: resultStr },
          });
          // Update ephemeral message
          await DiscordRequest(endpoint, {
            method: "PATCH",
            body: {
              content: "Nice choice " + getRandomEmoji(),
              components: [],
            },
          });
        } catch (err) {
          console.error("Error sending message:", err);
        }
      }
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
