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
} from "discord.js";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
  flipper,
} from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";

const userId = `get/users/{user.id}`;
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

const userInfo = {
  user: userId,
  knuts: Number,
  ytTokens: Number,
};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

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
    const { name, options } = data;

    if (name === "daily") {
      
      const currentTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if the user has already claimed their daily reward
      if (lastClaimedRewards[userId] && currentTime - lastClaimedRewards[userId] < oneDay) {
      // User has already claimed their reward within the last 24 hours
        const timeLeft = oneDay - (currentTime - lastClaimedRewards[userId]);
        const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "working on it",
          },
        }
                        }
    }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
