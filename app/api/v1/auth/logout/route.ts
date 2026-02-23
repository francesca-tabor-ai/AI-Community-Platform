import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-v1/errors";

const REFRESH_TOKEN_COOKIE = "refresh_token";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (refreshToken) {
      await prisma.vibeNetRefreshToken.deleteMany({ where: { token: refreshToken } }).catch(() => {});
      cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
    }

    return Response.json({ message: "Logged out" });
  } catch {
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
