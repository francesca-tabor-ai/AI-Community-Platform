import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, apiError } from "@/lib/api-v1/errors";

const createUserSchema = z.object({
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const { username, email, password, first_name, last_name } = parsed.data;
    const name = [first_name, last_name].filter(Boolean).join(" ") || username;

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) return conflict("Email already registered");

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) return conflict("Username already taken");

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name: name || username,
      },
    });

    return Response.json(
      {
        user_id: user.id,
        username: user.username,
        email: user.email,
        first_name: null,
        last_name: null,
        profile_picture_url: user.image,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
