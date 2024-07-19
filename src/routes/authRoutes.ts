import { Router } from "express";
import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { AuthValidator } from "../validators/AuthValidator";
import { ErrorService } from "../services/ErrorService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

//services
const authService = new AuthService();
const errorService = new ErrorService();

//controllers
const authController = new AuthController(authService);

//validators
const authValidator = new AuthValidator(errorService);

//middlewares
const authMiddleware = new AuthMiddleware(authService);

const router = Router();

router.get("/refresh", authController.getAccessToken.bind(authController));

router.get(
  "/test",
  authMiddleware.verifyToken.bind(authMiddleware),
  authController.getData.bind(authController)
);

router.post(
  "/register",
  authValidator.registerValidation.bind(authValidator),
  authController.register.bind(authController)
);

router.post(
  "/login",
  authValidator.loginValidation.bind(authValidator),
  authController.login.bind(authController)
);

export const authRoutes = router;
