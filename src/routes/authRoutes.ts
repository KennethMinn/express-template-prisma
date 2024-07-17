import { Router } from "express";
import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { AuthValidator } from "../validators/AuthValidator";
import { ErrorService } from "../services/ErrorService";

const authService = new AuthService();
const authController = new AuthController(authService);
const errorService = new ErrorService();
const authValidator = new AuthValidator(errorService);

const router = Router();

router.post(
  "/register",
  authValidator.registerValidation.bind(authValidator),
  authController.register.bind(authController)
);

export const authRoutes = router;
