export function generateGameState(stage) {
  const positions = ["left", "right"];
  const screen = [];
  const sequence = [];

  for (let i = 0; i < 5; i++) {
    const position = positions[Math.floor(Math.random() * positions.length)];
    sequence.push(position);
    screen.push(position === "left" ? "🏀🗑️" : "🗑️🏀");
  }

  return {
    sequence,
    screen: screen.reverse().join("\n"),
  };
}
