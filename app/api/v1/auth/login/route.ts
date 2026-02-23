import { NextRequest } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/api-v1/jwt";
import { badRequest, unauthorized, apiError } from "@/lib/api-v1/errors";
import { z } from "zod";

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

    const access_token = await signToken({
      userId: user.id,
      email: user.email!,
      role: user.role ?? "reader",
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
