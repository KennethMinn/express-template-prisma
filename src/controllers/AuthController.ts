import { Request, Response } from "express";
import { authService, AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}

  register(req: Request, res: Response) {
    return this.authService.registerUser(req, res);
  }

  login(req: Request, res: Response) {
    return this.authService.loginUser(req, res);
  }

  getAccessToken(req: Request, res: Response) {
    return this.authService.handleRefresh(req, res);
  }

  getData(_req: Request, res: Response) {
    return res.status(200).json({ message: "pass" });
  }
}

export const authController = new AuthController(authService);
