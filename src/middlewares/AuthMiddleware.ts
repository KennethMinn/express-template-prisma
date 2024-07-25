import { verify } from "crypto";
import { authService, AuthService } from "../services/AuthService";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  verifyToken(req: Request, res: Response, next: NextFunction) {
    return this.authService.verifyToken(req, res, next);
  }
}

export const authMiddleware = new AuthMiddleware(authService);
