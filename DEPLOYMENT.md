# Deploy to Railway with PostgreSQL

This guide walks you through deploying the AI Community Platform to Railway with PostgreSQL.

## Prerequisites

- GitHub account (repo connected to Railway)
- Railway account ([railway.app](https://railway.app))

---

## 1. Create a Railway Project

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select this repository.
4. Railway will create a new project and service.

---

## 2. Add PostgreSQL with pgvector

**Important:** This app uses the `vector` extension (pgvector) for AI embeddings. Standard Railway PostgreSQL does **not** include pgvector.

### Option A: Use the pgvector template (recommended for new projects)

1. In your Railway project, click **+ New**.
2. Select **Database** → **Postgres with pgVector Engine** (or [deploy it directly](https://railway.com/deploy/postgres-with-pgvector-engine)).
3. Railway will provision a PostgreSQL database with pgvector pre-enabled.

### Option B: Use pgvector image for existing Postgres

If you already have standard PostgreSQL:

1. Open your PostgreSQL service → **Settings**.
2. Change the **Source Image** to `pgvector/pgvector:pg17`.
3. Redeploy the database.

---

## 3. Connect the Web Service to the Database

1. Select your **web service** (the Next.js app).
2. Go to **Variables**.
3. Click **Add Variable** → **Add Reference**.
4. Select your PostgreSQL service’s `DATABASE_URL`. Railway will expose it as an environment variable.

---

## 4. Add Required Environment Variables

In your web service → **Variables**, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | (From Postgres reference - see step 3) | `postgresql://...` |
| `AUTH_SECRET` | NextAuth secret (use `openssl rand -base64 32`) | Random 32+ char string |
| `NEXTAUTH_URL` | Public URL of your app | `https://your-app.railway.app` |
| `OPENAI_API_KEY` | OpenAI API key (for AI features) | `sk-...` |
| `ADMIN_SECRET` | Admin dashboard access | Secure random string |

Optional (for full features):

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Payments
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` – Contact form emails
- `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` – Alternative AI providers

---

## 5. Build and Deploy

The `railway.json` in this repo defines:

- **Build:** `prisma generate` → `prisma migrate deploy` → `npm run build`
- **Start:** `npm start`

On each deploy, Railway will:

1. Install dependencies.
2. Generate the Prisma client and run migrations.
3. Build the Next.js app.
4. Start the production server.

---

## 6. Generate a Domain

1. In your web service, go to **Settings** → **Networking**.
2. Click **Generate Domain**.
3. Copy the URL (e.g. `https://ai-community-platform-production.up.railway.app`).
4. Set `NEXTAUTH_URL` in Variables to this URL (with `https://`).

---

## 7. Seed the Database (Optional)

To add demo data (users, a sample community, posts, events):

```bash
npm run db:seed
```

**Note:** Use the **public** `DATABASE_URL` from Railway (in `.env` or `.env.local`)—`postgres.railway.internal` is not reachable from your local machine. The seed creates 3 demo users (alice@example.com, bob@example.com, carol@example.com) with password `demo1234`.

## 8. Verify the Deployment

- Visit the generated domain.
- Open `/admin` and sign in with `ADMIN_SECRET`.
- Check that the database is working (e.g. contact form submissions appear in admin).

---

## Local Development with Railway Postgres

Use the **public** `DATABASE_URL` from the Railway dashboard (not `postgres.railway.internal`) for local development:

1. PostgreSQL service → **Variables** / **Connect**.
2. Copy the **Public** connection URL.
3. Add it to `.env.local` as `DATABASE_URL`.

`postgres.railway.internal` only works inside Railway’s private network.


---

## Future: AWS Deployment

For production-grade AWS deployment (EKS, RDS, S3, SQS, etc.), CI/CD pipelines, and multi-environment setup, see **[docs/INFRASTRUCTURE.md](./docs/INFRASTRUCTURE.md)**. That document describes the target cloud architecture, GitHub Actions pipeline design, monitoring, backup, and disaster recovery strategy.
