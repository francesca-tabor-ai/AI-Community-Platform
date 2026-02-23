import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, apiError } from "@/lib/api-v1/errors";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  role: z.enum(["creator", "reader"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const { email, password, username, role = "reader" } = parsed.data;

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return conflict("Email already registered");
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return conflict("Username already taken");
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: role as "creator" | "reader",
        name: username,
      },
    });

    return Response.json({
      user_id: user.id,
      message: "User registered successfully",
    });
  } catch {
    return apiError(500, "Internal server error", {
      code: "INTERNAL_ERROR",
    });
  }
}
