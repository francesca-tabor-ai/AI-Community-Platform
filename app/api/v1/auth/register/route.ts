import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  signShortLivedToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from "@/lib/api-v1/jwt";
import { badRequest, conflict, apiError } from "@/lib/api-v1/errors";

const REFRESH_TOKEN_COOKIE = "refresh_token";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
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

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) return conflict("Email already registered");

    const hashedPassword = await hash(password, 10);
    const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    let uniqueUsername = username;
    let n = 0;
    while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
      uniqueUsername = `${username}_${++n}`;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username: uniqueUsername,
        role: "creator",
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email!,
      role: "creator",
    });

    return Response.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: {
          access_token: token,
          token_type: "Bearer",
        },
      },
      { status: 201 }
    );
  } catch {
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
