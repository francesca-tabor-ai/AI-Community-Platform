# Email Infrastructure

This document describes the email delivery system for the AI Community Platform, built to the [Email Infrastructure Engineer spec](../Specification/Community/Email%20Infrastructure%20Engineer%20Agent%20Email%20Delivery%20Systems%20for%20a%20Creator%20Publishing%20Platform.md).

## Architecture Overview

```
Application Services → Message Queue (DB) → Email Worker → Resend (ESP) → Recipient
                              ↑                                    ↓
                              └──── Webhooks (bounces, complaints) ─┘
```

- **Queue**: Database-backed (`EmailJob` table). Can be swapped for SQS/RabbitMQ later.
- **Worker**: Processes jobs via cron (`/api/email/worker`) or standalone script (`npm run email:worker`).
- **ESP**: Resend (already in use for contact form).

## Components

### 1. Email Queue (`lib/email/queue.ts`)

- `enqueueEmail(message)` – Single email
- `enqueueEmailBatch(messages)` – Batch (e.g. new post to all subscribers)
- `enqueueNewPostNotification()` – Helper for new post notifications
- `enqueueWelcome()` – Helper for welcome emails

### 2. Email Worker (`lib/email/worker.ts`)

- Processes up to 25 jobs per run
- **Retry strategy**: 3 immediate retries, then exponential backoff (5 min → 1 hour)
- **Max attempts**: 7 (configurable per job)
- **Dead-letter**: Jobs that exceed max attempts move to `dead` status
- Respects `EmailUnsubscribe` (list hygiene)

### 3. Templates (`lib/email/templates/`)

Supported types: `new_post_notification`, `welcome`, `subscription_confirmation`, `subscription_cancelled`, `event_reminder`.

All emails include a one-click unsubscribe link (CAN-SPAM/GDPR compliant).

### 4. API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/email/send` | POST | Enqueue email (internal; requires `EMAIL_INTERNAL_API_KEY`) |
| `/api/email/worker` | GET | Process queue (cron; requires `CRON_SECRET`) |
| `/api/email/unsubscribe?email=...` | GET | One-click unsubscribe |
| `/api/email/webhooks/resend` | POST | Resend webhooks (bounces, complaints, delivered) |

### 5. Webhook Configuration

In [Resend Dashboard → Webhooks](https://resend.com/webhooks):

1. Add endpoint: `https://your-domain.com/api/email/webhooks/resend`
2. Select events: `email.bounced`, `email.complained`, `email.delivered`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | Resend API key |
| `RESEND_FROM_EMAIL` | No | From address (default: `onboarding@resend.dev`) |
| `NEXT_PUBLIC_APP_URL` | No | App URL for links (default: Vercel URL or localhost) |
| `CRON_SECRET` | Yes (Vercel) | Secret for `/api/email/worker` cron auth |
| `EMAIL_INTERNAL_API_KEY` | No | Secret for `/api/email/send` internal API |

## Deployment

### Vercel

- Cron runs every minute (see `vercel.json`)
- Set `CRON_SECRET` in Vercel env vars

### Self-Hosted (Railway, EC2, etc.)

Run the standalone worker:

```bash
npm run email:worker
```

Or trigger via external cron:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-app.com/api/email/worker
```

## Integration: New Post Notifications

When a creator publishes a post (PATCH post with `status: "published"`):

1. Post is updated in the database
2. Community members + paid subscribers (excluding author) are fetched
3. `new_post_notification` emails are enqueued for each recipient
4. Worker sends them asynchronously

## Database Schema

- **EmailJob**: Queue table (`status`, `attempts`, `scheduledAt`, `templateData`, etc.)
- **EmailFeedback**: Bounces, complaints, deliveries from Resend webhooks
- **EmailUnsubscribe**: Unsubscribed addresses (list hygiene)

Run migration:

```bash
npx prisma migrate deploy
```
