import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export function currentUser (jwtKey: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
      return next();
    }

    try {
      const payLoad = jwt.verify(req.session.jwt, jwtKey) as UserPayload;
      req.currentUser = payLoad;
    } catch (error) { }

    next();
  }
}