import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSecret, getAdminCookieConfig } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    const secret = getAdminSecret();

    if (!secret) {
      return NextResponse.json(
        { error: "Admin not configured. Set ADMIN_SECRET." },
        { status: 503 }
      );
    }

    if (key !== secret) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
    }

    const config = getAdminCookieConfig();
    const cookieStore = await cookies();
    cookieStore.set(config.name, key, {
      maxAge: config.maxAge,
      httpOnly: config.httpOnly,
      secure: config.secure,
      sameSite: config.sameSite,
      path: config.path,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
