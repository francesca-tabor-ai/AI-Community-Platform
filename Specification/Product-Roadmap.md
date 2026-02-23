# Product Roadmap — Creator Publishing Platform

> Phased feature roadmap aligned with the CEO Business Strategy GTM phases. Released as a living document.

## Overview

| Phase | GTM Focus | Primary Deliverables |
|-------|-----------|----------------------|
| **Phase 1** | Creator Acquisition | Monetization setup, creator onboarding, referral |
| **Phase 2** | Audience Growth | Discovery, SEO, social sharing, email engagement |
| **Phase 3** | Ecosystem Expansion | Integrations, API, advanced community features |

---

## Phase 1: Creator Acquisition

**Objective:** Attract high-quality creators; enable them to monetize and manage their communities.

### 1.1 Monetization Foundation

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Stripe Checkout | Reader subscription flow; create Stripe Checkout Session, redirect to success/cancel | Stripe API |
| Stripe Webhook Handler | Process `checkout.session.completed`, `invoice.paid`, `customer.subscription.*` | Webhook endpoint |
| Subscription Tier Management | CRUD for tiers; sync with Stripe Prices; creator-set prices | SubscriptionTier model |
| Connect Stripe Account | Creator onboarding: Stripe Connect Express or Custom for payouts | Stripe Connect |

### 1.2 Creator Experience

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Monetization Settings Page | Configure paid/free, tiers, connect payment provider | Dashboard |
| Creator Onboarding Flow | Guided setup: profile, community, first tier, first post | Auth, Profile |
| Revenue Share Configuration | Platform cut % by plan; display in creator settings | PlatformConfig or env |
| Creator Earnings Summary | Simple view: MRR, subscriber count, earnings (pre-payout) | Analytics, Subscription |

### 1.3 Acquisition Channels

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Referral Program | Creators invite peers; incentives (e.g., bonus earnings, discount) | User, Profile |
| Content Marketing Assets | Creator case studies, pricing guides, “Why join” page | Marketing site |
| Direct Outreach Support | CSV import for invites; invite email template | Admin, Email |

### Phase 1 Success Metrics

- Creator sign-ups
- Creators with ≥1 paid tier configured
- Creators with Stripe connected
- First paid subscription

---

## Phase 2: Audience Growth

**Objective:** Leverage creators to grow reader base; improve discoverability and engagement.

### 2.1 Discovery & SEO

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Creator Discovery Page | Browse/search creators and communities; filters by topic, tier | Community, Post |
| SEO Metadata | `meta` tags, Open Graph, structured data for creator profiles and posts | Next.js Metadata |
| Sitemaps | Dynamic sitemap for public creators and posts | Next.js sitemap |
| Creator Profiles (Public) | SEO-friendly public profile page with bio, tiers, recent posts | Profile, Community |

### 2.2 Social & Sharing

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Share Buttons | Share post/profile to Twitter, LinkedIn, copy link | UI components |
| Embeddable Widgets | Optional: embed preview card for posts/profiles | Iframe or oEmbed |
| UTM Tracking | Campaign params for attribution | Analytics |

### 2.3 Engagement

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Email Digest | Weekly/daily digest of new posts from subscribed creators | Email queue |
| Recommendations | “You might like” creators/posts based on subscriptions and activity | Analytics, ML optional |
| Curated Lists | Editorial or algorithmic lists (e.g., “Trending”, “New”) | Admin or algorithm |

### Phase 2 Success Metrics

- Organic traffic (creators + posts)
- New readers from discovery
- Share rate
- Email open/click rates

---

## Phase 3: Ecosystem Expansion & Diversification

**Objective:** Expand beyond core publishing; support integrations and advanced community use cases.

### 3.1 Integrations

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Zapier / Make | Triggers: new post, new subscriber, payment; actions: create post | Webhooks, API |
| Analytics Integrations | Google Analytics, Mixpanel, etc. via client-side or server events | Analytics |
| Marketing Automation | Export subscribers; sync with Mailchimp, ConvertKit, etc. | API, CSV export |

### 3.2 API & Developers

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Public API | REST or GraphQL for posts, subscribers, communities (read/write where appropriate) | Auth, rate limiting |
| API Keys & OAuth | Creator-scoped API keys; OAuth for third-party apps | Auth |
| Webhook Subscriptions | Creators subscribe to events (post.published, subscription.created) | Event system |
| API Documentation | OpenAPI/Swagger; interactive docs | Docs site |

### 3.3 Community Features

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| Direct Messaging | Creator ↔ subscriber DMs | Chat/Message model |
| Live Q&A / Sessions | Scheduled live events with Q&A | Events, real-time |
| Badges & Gamification | Badges for publishing, engagement, loyalty | Activity, Badge model |
| Premium Creator Tools | Advanced analytics, custom branding, priority support (paid add-on) | Billing, Feature flags |

### Phase 3 Success Metrics

- API usage
- Integration installs
- Community engagement (messages, live attendance)
- Premium tool adoption

---

## Cross-Cutting Priorities

- **Security & Compliance:** PCI via Stripe; GDPR-ready; audit logs for payments
- **Analytics:** Core events (`creator_subscribed`, `payment_succeeded`, etc.) in place; expand dashboards
- **Performance:** Caching, CDN, DB indexing for discovery and feeds
- **Localization:** i18n for creator-facing and reader-facing UI (future)
