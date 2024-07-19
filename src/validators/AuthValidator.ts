import { NextFunction, Request, Response } from "express";
import { ErrorService } from "../services/ErrorService";
import { registerSchema } from "../types/auth/schemas/registerSchema";
import { loginSchema } from "../types/auth/schemas/loginSchema";

export class AuthValidator {
  constructor(private errorService: ErrorService) {}

  registerValidation(req: Request, res: Response, next: NextFunction) {
    return this.errorService.handleErrorMessage(registerSchema, req, res, next);
  }

  loginValidation(req: Request, res: Response, next: NextFunction) {
    return this.errorService.handleErrorMessage(loginSchema, req, res, next);
  }
}
