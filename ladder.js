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
