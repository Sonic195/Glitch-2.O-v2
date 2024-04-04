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
  name: "water-bucket-clutch",
  description: "attempt a water bucket clutch",
  type: 1,
};

const IOTD_COMMAND = {
  name: "image-of-the-day",
  description: "get the nasa image of the day",
  type: 1,
};

const IMAGE_COMMAND = {
  name: "image",
  description: "search for image",
  type: 1,
  options: [
    {
      name: "search",
      description: "search for image",
      type: 3,
      required: true
    }
  ]
};

const CALLER_COMMAND = {
  name: "caller",
  description: "@ a user",
  type: 1,
  options: [
    {
      name: "user",
      description: "who to @",
      type: 6,
      required: true,
    },
    {
      name: "type",
      description: "type of call",
      type: 3,
      required: true,
      choices: [
        {
          name: "where are you",
          value: "1",
        },
        {
          name: "hurry up",
          value: "2",
        },
        {
          name: "hello??",
          value: "3",
        },
        {
          name: "come online",
          value: "4",
        },
        {
          name: "you suck",
          value: "5",
        }
      ]
    }
  ]
}

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

const ANNOUNCE_COMMAND = {
  name: "announce",
  description: "make an announcement",
  type: 1,
  options: [
    {
      name: "title",
      description: "title of announcement",
      type: 3,
      required: true,
    },
    {
      name: "sub-title",
      description: "sub title of announcement",
      type: 3,
      required: false,
    },
    {
      name: "context",
      description: "context of announcement",
      type: 3,
      required: false,
    },
    {
      name: "sub-title2",
      description: "sub title of announcement",
      type: 3,
      required: false,
    },
    {
      name: "context2",
      description: "context of announcement",
      type: 3,
      required: false,
    },
    {
      name: "p.s.",
      description: "add a ps",
      type: 3,
      required: false,
    }
  ]
}

const PING_COMMAND = {
  name: "ping",
  description: "pong",
  type: 1,
}

const YOUTUBE_COMMAND = {
  name: "youtube",
  description: "what to watch...",
  type: 1,
  options: [
    {
      name: "query",
      description: "search youtube",
      type: 3,
      required: true,
    },
    {
      name: "videos",
      description: "number of vids for the request. must be single digit and < 0.",
      type: 4,
      required: true,
    }
  ]
}


const ALL_COMMANDS = [
  TEST_COMMAND,
  CHALLENGE_COMMAND,
  GLITCH_COMMAND,
  COINFLIP_COMMAND,
  WBC_COMMAND,
  IOTD_COMMAND,
  IMAGE_COMMAND,
  CALLER_COMMAND,
  GIF_COMMAND,
  ANNOUNCE_COMMAND,
  PING_COMMAND,
  YOUTUBE_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
