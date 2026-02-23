# Vercel 404 Troubleshooting

If https://ai-community-platform-seven.vercel.app/ shows "The page could not be found" (NOT_FOUND), that’s **Vercel’s platform 404**, not the app’s custom 404. It usually means the build failed or there’s a deployment/config problem.

## 1. Check build logs

1. Open your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **AI Community Platform** project
3. Open **Deployments** and the latest deployment
4. Check **Build Logs** for errors

Typical causes:

- **Prisma**: `prisma generate` (in `postinstall`) must succeed. `DATABASE_URL` is not required for build.
- **TypeScript**: Ensure there are no type errors.
- **Memory**: Very large builds can hit limits; try reducing dependencies if needed.

## 2. Project settings

Under **Settings → General**:

- **Framework Preset**: `Next.js`
- **Build Command**: leave empty (default `npm run build`)
- **Output Directory**: leave empty (default `.next`)
- **Root Directory**: `.` (repo root)
- **Install Command**: `npm install` or `npm ci`

## 3. Environment variables

For build: only optional env vars are needed. `DATABASE_URL` is only required at runtime for API routes that use the database.

For production: add at least `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_SECRET` and any others your app needs.

## 4. Custom 404 vs platform 404

- **App custom 404**: "App-level 404 (custom)" → Next.js is running and routing works.
- **Platform 404**: "The page could not be found" + `NOT_FOUND` → build or deployment/config issue.

## 5. Force a redeploy

After fixing config or env vars:

- **Redeploy**: in the project’s **Deployments** tab, open the latest deployment and click **Redeploy**
- Or push a new commit to trigger a new deployment
