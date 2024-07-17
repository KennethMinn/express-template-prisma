import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}

  register(req: Request, res: Response) {
    return this.authService.registerUser(req, res);
  }
}
