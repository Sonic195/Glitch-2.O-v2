import "dotenv/config";
import { getRPSChoices } from "./game.js";
import { capitalize, InstallGlobalCommands } from "./utils.js";

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: "test",
  description: "Basic command",
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: "challenge",
  description: "Challenge to a match of rock paper scissors",
  options: [
    {
      type: 3,
      name: "object",
      description: "Pick your object",
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

// This is an example CHAT_INPUT or Slash Command, with a type of 1
const GLITCH_COMMAND = {
  name: "glitcher",
  type: 1,
  description: "404_description_not_found",
  options: [
    {
      name: "test1",
      description: "its just a test",
      type: 3,
      required: true,
      choices: [
        {
          name: "java",
          value: "fire",
        },
        {
          name: "c++",
          value: "overpowered graphics",
        },
        {
          name: "python",
          value: "easiest",
        },
      ],
    },
    {
      name: "test2",
      description: "only a test",
      type: 5,
      required: false,
    },
  ],
};

const COINFLIP_COMMAND = {
  name: "coinflip",
  description: "heads or tails?",
  type: 1,
  options: [
    {
      name: "biasness",
      description: "wink",
      type: 3,
      required: false,
      choices: [
        {
          name: "heads",
          value: "heads",
        },
        {
          name: "tails",
          value: "tails",
        },
      ],
    },
  ],
};

const WBC_COMMAND = {
  name: "wbc",
  description: "attempt a water bucket clutch",
  type: 1,
};

const ALL_COMMANDS = [
  TEST_COMMAND,
  CHALLENGE_COMMAND,
  GLITCH_COMMAND,
  COINFLIP_COMMAND,
  WBC_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
