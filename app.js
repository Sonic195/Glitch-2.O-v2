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
import { testEmbed, ytEmbed, awakeEmbed } from "./embed.js";
import { Schema, model } from "mongoose";
import { getGameState, saveGameState, deleteGameState } from "./ladder.js";

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
  glitchos: Number,
  ytTokens: Number,
  lastClaimed: Date,
});

const Data = "./Schema.js";

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

    if (name === "ladder") {
      const ladderEmbed = new EmbedBuilder()
        .setColor(0xadd8e6)
        .setTitle("The Ladder Minigame")
        .addFields(
          {
            name: "Tutorial",
            value:
              "Press the buttons in order of the baskets starting from below and ending at the top. If you don't complete a stage in time, or press the button in the wrong order, the game is over.",
          },
          {
            name: "Developer's High Score",
            value:
              "I made it till stage 21. think you can ACTUALLY beat it? In your dreams, probably.",
          }
        )
        .setTimestamp()
        .setFooter({
          text: "bad luck!",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
        });

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [ladderEmbed],
          components: [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 2, // Button
                  custom_id: "start_game",
                  style: 1, // Primary
                  label: "GO",
                },
              ],
            },
          ],
        },
      });
    }

    if (name === "awake") {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [awakeEmbed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "awake_button",
                  style: 2,
                  label: "Wake Up 💀",
                },
              ],
            },
          ],
        },
      });
    }

    if (name === "reg") {
      const user = await Data.findOne({ userId });
      if (!user) {
        await Data.create({
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
      try {
        const user = await data.findOne({ userId });
        if (!user) {
          await data.create({
            userId,
            lastClaimed: new Date(),
          });
        }
      } catch (error) {
        console.error("error with daily:", error);
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
      const ytEmbed = new EmbedBuilder()
        .setColor(0xadd8e6)
        .setTitle("YouTube")
        .setURL("https://www.youtube.com/")
        .setAuthor({
          name: "Glitch 2.O",
          iconURL:
            "https://cdn.glitch.global/735481a2-904c-41de-b19a-67260bbf38b2/IMG_0527.jpeg?v=1717832468897",
        })
        .setDescription("Go get some popcorn")
        .setThumbnail(
          "https://cdn.glitch.global/735481a2-904c-41de-b19a-67260bbf38b2/IMG_0527.jpeg?v=1717832468897"
        )
        .addFields({
          name: "Amount of Glitchos left",
          value: "working on it",
        })
        .setTimestamp()
        .setFooter({
          text: "just chillin",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
        });

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [ytEmbed],
          components: [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 2, // Button
                  custom_id: "yt_search_button",
                  style: 1, // Primary
                  label: "Search YouTube",
                },
                {
                  type: 2,
                  custom_id: "yt_search_button_icognito",
                  style: 1,
                  label: "Hidden"
                }
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

    if (componentId.startsWith("start_game")) {
      function generateGameState(stage) {
        const positions = ["left", "right"];
        const screen = [];
        const sequence = [];

        for (let i = 0; i < 5; i++) {
          const position =
            positions[Math.floor(Math.random() * positions.length)];
          sequence.push(position);
          screen.push(position === "left" ? "🚧🗑️" : "🗑️🚧");
        }

        return {
          sequence,
          screen: screen.reverse().join("\n"),
        };
      }

      function updateGameState(userId, move) {
        const gameState = getGameState(userId);
        const expectedMove = gameState.sequence[gameState.currentMove];

        if (move === expectedMove) {
          gameState.currentMove++;

          if (gameState.currentMove === gameState.sequence.length) {
            gameState.stage++;
            gameState.currentMove = 0;
            gameState.timeLeft = 3;
            Object.assign(gameState, generateGameState(gameState.stage));
          } else {
            const position = gameState.sequence[gameState.currentMove];
            gameState.screen = gameState.screen
              .split("\n")
              .map((row, index) => {
                if (index === 4 - gameState.currentMove) {
                  return position === "left" ? "🏀🗑️" : "🗑️🏀";
                }
                return row;
              })
              .join("\n");
          }

          saveGameState(userId, gameState);
          return gameState;
        } else {
          return null; // Indicates wrong move
        }
      }

      const gameState = generateGameState(1);

      saveGameState(userId, {
        ...gameState,
        stage: 1,
        currentMove: 0,
        timeLeft: 3,
      });

      const gameEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("The Ladder Minigame")
        .addFields(
          { name: "Stage", value: "1", inline: true },
          { name: "Time Left", value: "3 seconds", inline: true }
        )
        .setDescription(gameState.screen)
        .setTimestamp()
        .setFooter({
          text: "Can you make it to the top?",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
        });

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [gameEmbed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "move_left",
                  style: 1,
                  label: "Left",
                },
                {
                  type: 2,
                  custom_id: "move_right",
                  style: 1,
                  label: "Right",
                },
              ],
            },
          ],
        },
      });
    }

    if (componentId.startsWith("move_left" || "move_right")) {
      const userId = req.body.member.user.id;
      const userMove = data.custom_id === "move_left" ? "left" : "right";

      // Fetch the game state from a database or in-memory store
      const gameState = getGameState(userId);

      if (gameState.sequence[gameState.currentMove] === userMove) {
        gameState.currentMove++;

        if (gameState.currentMove === gameState.sequence.length) {
          gameState.stage++;
          gameState.currentMove = 0;
          gameState.timeLeft = 3;
          gameState = generateGameState(gameState.stage);
        }
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Game over! You pressed the wrong button.",
          },
        });
      }

      const gameEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("The Ladder Minigame")
        .addFields(
          { name: "Stage", value: gameState.stage.toString(), inline: true },
          {
            name: "Time Left",
            value: `${gameState.timeLeft} seconds`,
            inline: true,
          }
        )
        .setDescription(gameState.screen)
        .setTimestamp()
        .setFooter({
          text: "Can you make it to the top?",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
        });

      // Save the updated game state to a database or in-memory store
      saveGameState(userId, gameState);

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          embeds: [gameEmbed],
          components: [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 2, // Button
                  custom_id: "move_left",
                  style: 1, // Primary
                  label: "Left",
                },
                {
                  type: 2, // Button
                  custom_id: "move_right",
                  style: 1, // Primary
                  label: "Right",
                },
              ],
            },
          ],
        },
      });
    }

    if (componentId.startsWith("awake_button")) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "the bot is online.",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
    }

    if (componentId.startsWith("yt_search_button")) {
      return res.send({
        type: InteractionResponseType.MODAL,
        data: {
          custom_id: "youtube_modal",
          title: "Search YouTube",
          components: [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 4, // Input Text
                  custom_id: "search_query",
                  style: 1, // Short
                  label: "Search...",
                  required: true,
                },
              ],
            },
          ],
        },
      });
    }
    
    if (componentId.startsWith("yt_search_button_icognito")) {
      return res.send({
        type: InteractionResponseType.MODAL,
        data: {
          custom_id: "youtube_modal_icognito",
          title: "Search YouTube",
          components: [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 4, // Input Text
                  custom_id: "search_query",
                  style: 1, // Short
                  label: "Search...",
                  required: true,
                },
              ],
            },
          ],
        },
      });
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

  if (type === InteractionType.MODAL_SUBMIT) {
    const modalId = data.custom_id;

    if (modalId === "youtube_modal") {
      const searchQueryComponent =
        data.components &&
        data.components[0] &&
        data.components[0].components[0];

      if (searchQueryComponent && searchQueryComponent.value) {
        const userId = req.body.member.user.id;
        const searchQuery = searchQueryComponent.value;

        // Log the search query to debug
        console.log("Search query:", searchQuery);

        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
              searchQuery
            )}&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );
          const responseData = await response.json();

          // Log the API response to debug
          console.log("YouTube API response:", responseData);

          if (
            responseData &&
            responseData.items &&
            responseData.items.length > 0
          ) {
            const videoId = responseData.items[0].id.videoId;

            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `https://www.youtube.com/watch?v=${videoId}`,
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
      } else {
        // Handle case where search query component or its value is missing
        console.error("Search query component or value is missing.");
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Invalid search query received.",
          },
        });
      }
    }
    
    if (modalId === "youtube_modal_icognito") {
      const searchQueryComponent =
        data.components &&
        data.components[0] &&
        data.components[0].components[0];

      if (searchQueryComponent && searchQueryComponent.value) {
        const userId = req.body.member.user.id;
        const searchQuery = searchQueryComponent.value;

        // Log the search query to debug
        console.log("Search query:", searchQuery);

        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
              searchQuery
            )}&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );
          const responseData = await response.json();

          // Log the API response to debug
          console.log("YouTube API response:", responseData);

          if (
            responseData &&
            responseData.items &&
            responseData.items.length > 0
          ) {
            const videoId = responseData.items[0].id.videoId;
            const url = `https://www.youtube.com/watch?v=${videoId}`;

            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: url,
                ephemeral: true,
              },
            });
          } else {
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "No videos found for your query.",
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching from YouTube API:", error);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "An error occurred while fetching videos.",
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        }
      } else {
        // Handle case where search query component or its value is missing
        console.error("Search query component or value is missing.");
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Invalid search query received.",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
    }
    
  }
  
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
