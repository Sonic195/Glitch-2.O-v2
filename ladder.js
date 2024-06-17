export function generateGameState(stage) {
  const positions = ["left", "right"];
  const screen = [];
  const sequence = [];

  for (let i = 0; i < 5; i++) {
    const position = positions[Math.floor(Math.random() * positions.length)];
    sequence.push(position);
    screen.push(position === "left" ? "🚧🗑️" : "🗑️🚧");
  }

  return {
    sequence,
    screen: screen.reverse().join("\n"),
  };
}

export const gameStates = {};

export function getGameState(userId) {
  return gameStates[userId] || { stage: 1, currentMove: 0, timeLeft: 3, sequence: [], screen: "" };
}

export function saveGameState(userId, gameState) {
  gameStates[userId] = gameState;
}
