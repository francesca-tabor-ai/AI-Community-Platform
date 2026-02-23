import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signShortLivedToken, generateRefreshToken, getRefreshTokenExpiry } from "@/lib/api-v1/jwt";
import { unauthorized, apiError } from "@/lib/api-v1/errors";

const REFRESH_TOKEN_COOKIE = "refresh_token";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return unauthorized("Refresh token required");
    }

    const stored = await prisma.vibeNetRefreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await prisma.vibeNetRefreshToken.delete({ where: { id: stored.id } }).catch(() => {});
      }
      return unauthorized("Invalid or expired refresh token");
    }

    const accessToken = await signShortLivedToken({
      userId: stored.user.id,
      email: stored.user.email!,
      role: stored.user.role ?? "reader",
    });

    const newRefreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();
    await prisma.vibeNetRefreshToken.delete({ where: { id: stored.id } }).catch(() => {});
    await prisma.vibeNetRefreshToken.create({
      data: { userId: stored.userId, token: newRefreshToken, expiresAt },
    });

    const cookieStore2 = await cookies();
    cookieStore2.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json({
      access_token: accessToken,
      token_type: "Bearer",
    });
  } catch {
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
