import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
} from "discord-interactions";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";
import { VerifyDiscordRequest } from "./utils.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Store for in-progress games and last claimed rewards
const activeGames = {};
const lastClaimedRewards = {};

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

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
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    if (name === "daily") {
      const userId = member.user.id;
      const currentTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Check if the user has already claimed their daily reward
      if (
        lastClaimedRewards[userId] &&
        currentTime - lastClaimedRewards[userId] < oneDay
      ) {
        // User has already claimed their reward within the last 24 hours
        const nextRewardTimestamp = Math.floor(
          (lastClaimedRewards[userId] + oneDay) / 1000
        );

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `You've already claimed your daily reward. Please wait until <t:${nextRewardTimestamp}:R>.`,
            flags: InteractionResponseFlags.EPHEMERAL, // Only the user can see this message
          },
        });
      } else {
        // User has not claimed their reward or it has been more than 24 hours
        lastClaimedRewards[userId] = currentTime;
        // Add coins to the user's account here
        // ...

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `You've claimed your daily reward of X knuts!`, // Replace X with the number of knuts you want to give
          },
        });
      }
    }
  }

  // Handle other interaction types...
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
