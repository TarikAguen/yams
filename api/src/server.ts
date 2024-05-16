import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes, { checkRevokedToken } from "./routes/auth";
import gameRoutes from "./routes/game";
import { authenticateJWT } from "./middleware/auth";

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.use("/auth", authRoutes);
app.use("/game", authenticateJWT, checkRevokedToken, gameRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
