# Analytics Infrastructure

This document describes the analytics event tracking schema, data pipeline, and dashboard data models implemented for the Creator Publishing Platform.

## Event Tracking Schema

### Core Event Properties (all events)

| Property    | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| `event_id`  | String    | Unique identifier for each event    |
| `event_name`| String    | Descriptive name of the event        |
| `timestamp` | ISO 8601  | UTC when the event occurred          |
| `user_id`   | String?   | User performing the action (if any)  |
| `session_id`| String    | User session identifier              |
| `platform`  | String    | `web`, `mobile_ios`, `mobile_android`|
| `device_type`| String   | `desktop`, `tablet`, `phone`         |
| `browser`   | String    | Browser name and version             |
| `os`        | String    | Operating system                     |
| `referrer`  | String?   | Previous page URL                    |

### Implemented Events

1. **user_registered** – New user signup  
   - `email`, `username?`, `role` (creator|reader), `registration_source?`

2. **user_logged_in** – Successful login  
   - `login_method` (email_password|google_oauth|github|other)

3. **post_viewed** – User views a post  
   - `post_id`, `creator_id`, `post_title?`, `time_on_page_seconds?`, `scroll_depth_percentage?`

4. **post_published** – Creator publishes a post  
   - `post_id`, `post_title`, `post_type` (article|newsletter|post)

5. **comment_submitted** – User submits a comment  
   - `post_id`, `comment_id`, `parent_comment_id?`

6. **creator_subscribed** – Reader subscribes to a creator  
   - `subscriber_id`, `creator_id`, `subscription_type` (free|paid), `tier_name?`

7. **payment_succeeded** – Successful subscription payment  
   - `creator_id`, `subscription_id`, `amount`, `currency`, `payment_method_type`, `is_renewal`

## Current Architecture

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ Client (Web/Mobile) │────▶│ POST /api/events │────▶│ PostgreSQL          │
│ analytics.xxx()    │     │ (Event Collector)│     │ AnalyticsEvent      │
└─────────────────────┘     └──────────────────┘     └─────────────────────┘
        │                                                       │
        │ usePostView, analytics.postViewed, etc.               │
        │                                                       ▼
        │                                            ┌─────────────────────┐
        │                                            │ Aggregation / APIs  │
        │                                            │ /api/analytics/*    │
        └────────────────────────────────────────────┴─────────────────────┘
```

### Components

- **Client SDK** (`lib/analytics/client.ts`): `analytics.postViewed()`, `analytics.userLoggedIn()`, etc.
- **Post view hook** (`lib/analytics/usePostView.ts`): Tracks time on page and scroll depth
- **Event collector** (`app/api/events/route.ts`): Validates and persists events
- **Server-side tracking** (`lib/analytics/track.ts`): `trackEvent()` for backend events
- **Aggregation** (`lib/analytics/aggregate.ts`): Creator summary, platform KPIs, post performance

## Integration Points

### Auth (when NextAuth/Clerk is wired)

```ts
// After successful signup
analytics.userRegistered({
  user_id: user.id,
  email: user.email,
  username: user.name,
  role: "creator", // or "reader"
  registration_source: "organic", // or "ad_campaign_x"
});

// After successful login
analytics.userLoggedIn({
  user_id: session.user.id,
  login_method: "email_password", // or "google_oauth", etc.
});
```

### Subscription / Payment

When creating a `Subscription` record or processing a Stripe webhook:

```ts
import { trackEvent } from "@/lib/analytics/track";

// creator_subscribed (Member join or Subscription create)
trackEvent({
  event_id: crypto.randomUUID(),
  event_name: "creator_subscribed",
  timestamp: new Date().toISOString(),
  user_id: subscriberId,
  subscriber_id: subscriberId,
  creator_id: community.ownerId,
  subscription_type: tier.price > 0 ? "paid" : "free",
  tier_name: tier.name,
});

// payment_succeeded (Stripe webhook)
trackEvent({
  event_id: crypto.randomUUID(),
  event_name: "payment_succeeded",
  timestamp: new Date().toISOString(),
  user_id: subscriberId,
  creator_id: community.ownerId,
  subscription_id: subscription.id,
  amount: 999, // cents
  currency: "usd",
  payment_method_type: "card",
  is_renewal: false,
});
```

### Post views

- **Blog posts**: `PostViewTracker` wraps the article on `app/blog/[slug]/page.tsx`
- **Community posts**: Add `PostViewTracker` when rendering a post detail view with `postId`, `creatorId` (post.authorId), `postTitle`, `userId`

## Dashboard APIs

| Endpoint | Description |
|----------|-------------|
| `GET /api/analytics/creator/[creatorId]/summary?days=30` | Creator daily summary (views, comments, subscribers, revenue) |
| `GET /api/analytics/platform/kpis?days=30` | Platform KPIs (users, MAU, DAU, posts, revenue) |
| `GET /api/analytics/posts/[postId]/performance?days=30` | Post performance (views, comments, avg time on page) |

## Future: Full Pipeline Architecture

For scale, the architecture can evolve to:

```
Client → API Gateway → Kafka/Kinesis → Stream Processing → S3 (Data Lake)
                                                      → Redshift (Warehouse) → BI Tools
                                                      → Real-time Dashboards
```

### Migration Path

1. **Event Collector**: Keep `/api/events`; add Kafka producer to dual-write
2. **Stream Processing**: Flink/Spark for validation, enrichment, aggregations
3. **Data Lake**: S3 with Parquet (`s3://.../year=YYYY/month=MM/day=DD/event_name=X/`)
4. **Warehouse**: Redshift/Snowflake star schema (fact_events, dim_users, dim_posts, dim_time)
5. **BI Tools**: Metabase, Looker, or Tableau for dashboards

### Data Governance

- **Definitions**: Events are typed in `lib/analytics/events.ts` with Zod schemas
- **Lineage**: Raw events → aggregation logic → dashboard APIs
- **Quality**: Schema validation at ingest; consider data quality checks in batch jobs

### Experimentation Support

The schema supports A/B tests by adding optional properties such as `experiment_id` and `variant` to events. Extend the Zod schemas and payload when experimentation is introduced.
