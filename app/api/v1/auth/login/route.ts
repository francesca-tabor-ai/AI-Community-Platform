import { NextRequest } from "next/server";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  signShortLivedToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from "@/lib/api-v1/jwt";
import { badRequest, unauthorized, apiError } from "@/lib/api-v1/errors";
import { z } from "zod";

const REFRESH_TOKEN_COOKIE = "refresh_token";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Invalid email or password");
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return unauthorized("Invalid email or password");
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return unauthorized("Invalid email or password");
    }

    const access_token = await signShortLivedToken({
      userId: user.id,
      email: user.email!,
      role: user.role ?? "reader",
    });

    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();
    await prisma.vibeNetRefreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

    const cookieStore = await cookies();
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: {
        access_token,
        token_type: "Bearer",
      },
    });
  } catch {
    return apiError(500, "Internal server error", {
      code: "INTERNAL_ERROR",
    });
  }
}
