import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return token === secret;
}

export async function setAdminSession(secret: string): Promise<boolean> {
  const expected = getAdminSecret();
  if (!expected || secret !== expected) return false;
  return true;
}

export function getAdminCookieConfig() {
  return {
    name: ADMIN_COOKIE,
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}
