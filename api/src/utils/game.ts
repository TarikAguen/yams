export const getDiceRoll = () => {
  const roll = [];
  for (let i = 0; i < 5; i++) {
    roll.push(Math.floor(Math.random() * 6) + 1);
  }
  return roll;
};

export const checkWinningCombination = (dice: number[]) => {
  const counts: { [key: number]: number } = {};
  dice.forEach((die) => (counts[die] = (counts[die] || 0) + 1));

  if (Object.values(counts).includes(5)) return "YAM'S";
  if (Object.values(counts).includes(4)) return "CARRÉ";
  if (Object.values(counts).filter((count) => count >= 2).length >= 2)
    return "DOUBLE";

  return null;
};
