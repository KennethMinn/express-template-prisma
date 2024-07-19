import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../db";
import { createHashPassword } from "../utils/createHashPassword";
import { createToken } from "../utils/createToken";
import jwt, { VerifyErrors } from "jsonwebtoken";
export class AuthService {
  async registerUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const userExisted = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExisted)
        return res.status(400).json({ message: "User already exits" });

      const hashedPassword = await createHashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch)
        return res.status(401).json({ message: "Invalid Credentials" });

      const payload = { id: user.id, email: user.email };

      const accessToken = createToken(
        payload,
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "20s" }
      );

      const refreshToken = createToken(
        payload,
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "1d" }
      );

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          refreshToken,
        },
      });

      //set http only cookie for 1 day
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //1day
      });

      return res.status(200).json({ user, accessToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async handleRefresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken)
      return res.status(400).json({ message: "Unauthenticated" });

    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!user) return res.status(400).json({ message: "Unauthenticated" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any) => {
      if (err) return res.status(401).json({ message: "Unauthenticated" }); //invalid token

      const payload = { id: user.id, email: user.email };

      const accessToken = createToken(
        payload,
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "20s" }
      );

      return res.status(200).json({ accessToken });
    });
  }

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.replace("Bearer", "").trim();

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: VerifyErrors | null, _decodedValue) => {
        if (err) {
          return res.status(401).json({ message: "Unauthenticated" });
        } else {
          next();
        }
      }
    );
  }
}
