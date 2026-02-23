/**
 * Custom 404 - if you see this, Next routing is running and you're hitting your app.
 * If you see Vercel's platform 404 instead, deployment/config may be wrong.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 480 }}>
      <h1>App-level 404 (custom)</h1>
      <p>If you see this, Next routing is running and you&apos;re hitting your app.</p>
      <p>
        <Link href="/" style={{ color: "#0070f3" }}>
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
