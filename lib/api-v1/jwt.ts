import * as jose from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? process.env.AUTH_SECRET ?? "fallback-secret-change-me"
);

const issuer = "ai-community-platform";
const expiresIn = "7d";

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export async function signToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  return new jose.SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuer(issuer)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, { issuer });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function getUserFromToken(
  authHeader: string | null
): Promise<{ id: string; email: string | null; role: string | null } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, role: true },
  });
  return user ?? null;
}
