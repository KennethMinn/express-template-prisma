import { Request, Response } from "express";
import { prisma } from "../db";

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

      const user = await prisma.user.create({
        data: {
          email,
          password,
        },
      });

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
