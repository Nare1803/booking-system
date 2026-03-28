"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { ActionResult } from "@/types";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: Role,
  specialty?: string
): Promise<ActionResult<{ email: string }>> {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email already registered." };
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        specialty: role === "DOCTOR" ? specialty : null,
      },
    });

    return { success: true, data: { email } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Registration failed." };
  }
}