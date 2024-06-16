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
      name: "bet",
      description: "bet some glitches flipping the coin",
      type: 3,
      required: false,
      choices: [
        {
          name: "low risk low reward",
          value: "lrlr",
        },
        {
          name: "high risk high reward",
          value: "hrhr",
        },
      ],
    },
  ],
};

const WBC_COMMAND = {
  name: "water-bucket-clutch",
  description: "attempt a water bucket clutch",
  type: 1,
};

const IOTD_COMMAND = {
  name: "image-of-the-day",
  description: "get the nasa image of the day",
  type: 1,
};

const GIF_COMMAND = {
  name: "gifify",
  description: "find gifs",
  type: 1,
  options: [
    {
      name: "search",
      description: "search for gif",
      type: 3,
      required: true
    }
  ]
};

const PING_COMMAND = {
  name: "ping",
  description: "pong",
  type: 1,
}

const YOUTUBE_COMMAND = {
  name: "youtube",
  description: "what to watch...",
  type: 1,
}

const PINGER_COMMAND = {
  name: "pinger",
  description: "ping the bot",
  type: 1,
};

const DAILY_COMMAND = {
  name: "daily",
  description: "your daily coins",
  type: 1,
}

const REG_COMMAND = {
  name: "reg",
  description: "register to the bot if you havent yet",
  type: 1,
}

const AWAKE_COMMAND = {
  name: "awake",
  description: "try to force the bot to come online",
  type: 1,
}

const GUESSER_COMMAND = {
  name: "guesser",
  description: "guess the number if its higher or lower",
  type: 1,
}

const ALL_COMMANDS = [
  TEST_COMMAND,
  CHALLENGE_COMMAND,
  COINFLIP_COMMAND,
  WBC_COMMAND,
  IOTD_COMMAND,
  GIF_COMMAND,
  PING_COMMAND,
  YOUTUBE_COMMAND,
  PINGER_COMMAND,
  DAILY_COMMAND,
  REG_COMMAND,
  AWAKE_COMMAND,
  GUESSER_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
