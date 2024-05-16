import { Request, Response } from "express";
import User from "../models/User";
import Pastry from "../models/Pastry";
import { getDiceRoll, checkWinningCombination } from "../utils/game";

export const playGame = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const user = await User.findById(userId);
  if (!user || user.plays >= 3) {
    return res
      .status(403)
      .send("Vous avez atteint le nombre maximum de participation");
  }

  const diceRoll = getDiceRoll();
  const winnings = checkWinningCombination(diceRoll);

  user.plays += 1;

  if (winnings) {
    // Determine the number of pastries to win
    const pastriesToWin =
      winnings === "YAM'S" ? 3 : winnings === "CARRÉ" ? 2 : 1;

    // On recup les patisseries dont le stock est supérieur à 0.
    const availablePastries = await Pastry.find({ stock: { $gt: 0 } }).limit(
      pastriesToWin
    );
    if (availablePastries.length < pastriesToWin) {
      return res.status(404).send("Not enough pastries available");
    }

    // maj quantités
    const prizesWon = [];
    for (const prize of availablePastries) {
      prize.quantityWon += 1;
      prize.stock -= 1;
      await prize.save();
      prizesWon.push(prize.name);
    }

    // Push du prix gagné dans l'user correspondant
    user.prizes.push(...prizesWon);
    const messageWin = `Vous avez gagné ${pastriesToWin} pâtisserie(s) : ${prizesWon.join(
      ", "
    )}`;
    await user.save();
    return res.status(200).json({ diceRoll, winnings, messageWin });
  }
  await user.save();
  res.json({ diceRoll, winnings, message: "Aucune pâtisserie gagnée" });
};
