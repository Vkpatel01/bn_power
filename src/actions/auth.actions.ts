"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const login = async (username: string, password: string) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !admin.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return {
      success: true,
      user: { id: admin.id, username: admin.username },
    };
  } catch (error) {
    return { success: false, error: "Login failed" };
  }
};
