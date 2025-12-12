import jwt from "jsonwebtoken";
import fs from "fs";
import { NextFunction, Request, Response } from "express";


const PUBLIC_KEY = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH || "jwt.key.pub", "utf8");

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const payload = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as jwt.JwtPayload;

    if (payload?.userId) {
      (req as Request & { userId: string }).userId = payload.userId;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(401);
  }
};

export { validateJWT };
