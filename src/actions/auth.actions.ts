"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    };
  } catch (error) {
    return { success: false, error: "Login failed" };
  }
};
