const gameStates = {};

export function getGameState(userId) {
  return gameStates[userId] || null;
}

export function saveGameState(userId, gameState) {
  gameStates[userId] = gameState;
}

export function deleteGameState(userId) {
  delete gameStates[userId];
}






function generateGameState(stage) {
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
