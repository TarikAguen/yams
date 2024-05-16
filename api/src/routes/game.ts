import { Router } from "express";
import { playGame } from "../controller/gameController";

const router = Router();

declare global {
  module Express {
    interface Request {
      user: any;
    }
  }
}

router.post("/play", playGame);

export default router;
