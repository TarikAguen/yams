import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();
const revokedTokens: Set<string> = new Set();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).send("Username already exists");
      // console.log(`Error: Username "${username}" already exists.`, err);
    } else {
      res.status(500).send("Error registering user");
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.json({
      message: `User connected: ${username}`,
      token,
      user: {
        username: user.username,
        plays: user.plays,
        prizes: user.prizes,
      },
    });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Route de déconnexion
router.post("/logout", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (token) {
    revokedTokens.add(token);
    res.send("User logged out successfully");
  } else {
    res.status(400).send("No token provided");
  }
});

// Middleware pour vérifier la révocation des tokens (à utiliser sur les routes protégées)
const checkRevokedToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (token && revokedTokens.has(token)) {
    return res.status(401).send("Token has been revoked");
  }
  next();
};

export { revokedTokens, checkRevokedToken };
export default router;
