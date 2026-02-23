import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "./jwt";
import { unauthorized, forbidden } from "./errors";

export type AuthUser = {
  id: string;
  email: string | null;
  role: string | null;
};

export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const user = await getUserFromToken(authHeader);
  if (!user) return unauthorized();
  return { user };
}

export async function requireCreator(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.user.role !== "creator") {
    return forbidden("Only creators can perform this action");
  }
  return result;
}
