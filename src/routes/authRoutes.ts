import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authValidator } from "../validators/AuthValidator";
import { authMiddleware } from "../middlewares/AuthMiddleware";

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
