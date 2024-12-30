import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {config} from "../infra/config";
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, config.jwtSecret as string, (err, user) => {
      if (err) return res.sendStatus(403);
      res.locals.user = user;
      next();
    });
  }