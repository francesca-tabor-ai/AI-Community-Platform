import { auth } from "@/auth";

/**
 * Get the current session on the server.
 * Use in Server Components and API routes.
 */
export async function getSession() {
  return auth();
}
