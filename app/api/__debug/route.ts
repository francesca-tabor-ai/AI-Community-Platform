/**
 * Diagnostic endpoint for Vercel deployment troubleshooting.
 * Hit /api/__debug to see deployed app state, env, and file tree.
 */

import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function safeReadJSON(p: string) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function listTree(root: string, depth = 3): string[] {
  const out: string[] = [];
  const walk = (dir: string, d: number) => {
    if (d < 0) return;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const rel = path.relative(root, full);
      if (e.isDirectory()) {
        out.push(rel + "/");
        walk(full, d - 1);
      } else {
        out.push(rel);
      }
    }
  };
  walk(root, depth);
  return out.slice(0, 500);
}

export async function GET() {
  const cwd = process.cwd();

  const pkg = safeReadJSON(path.join(cwd, "package.json"));
  const nextConfigPath = path.join(cwd, "next.config.ts");
  const nextConfigJsPath = path.join(cwd, "next.config.js");
  const nextConfig =
    fs.existsSync(nextConfigPath)
      ? fs.readFileSync(nextConfigPath, "utf8").slice(0, 5000)
      : fs.existsSync(nextConfigJsPath)
        ? fs.readFileSync(nextConfigJsPath, "utf8").slice(0, 5000)
        : null;

  const appDir = fs.existsSync(path.join(cwd, "app"));
  const pagesDir = fs.existsSync(path.join(cwd, "pages"));
  const vercelJson = safeReadJSON(path.join(cwd, "vercel.json"));

  return NextResponse.json({
    cwd,
    node: process.version,
    env: {
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
      VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    hasAppDir: appDir,
    hasPagesDir: pagesDir,
    vercelJson,
    packageJson: pkg,
    nextConfigPreview: nextConfig?.slice(0, 500) ?? null,
    tree: listTree(cwd, 2),
    appTree: appDir ? listTree(path.join(cwd, "app"), 4) : null,
    pagesTree: pagesDir ? listTree(path.join(cwd, "pages"), 4) : null,
  });
}
