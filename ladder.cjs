const gameStates = {};

function getGameState(userId) {
  return gameStates[userId] || { stage: 1, currentMove: 0, timeLeft: 3, sequence: [], screen: "", timer: null };
}

function saveGameState(userId, gameState) {
  gameStates[userId] = gameState;
}

module.exports = { getGameState, saveGameState };
