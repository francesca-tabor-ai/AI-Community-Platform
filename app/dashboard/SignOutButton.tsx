"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      Sign out
    </button>
  );
}
