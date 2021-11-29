import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { environment } from "../environment";

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

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payLoad = jwt.verify(req.session.jwt, environment.jwt_key) as UserPayload;
    req.currentUser = payLoad;
  } catch (error) { }

  next();
}