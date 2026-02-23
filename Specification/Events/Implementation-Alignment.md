# Event Platform Growth Strategy — Implementation Alignment

## Current Platform Context

The AI Community Platform is **community-centric** with events as a feature within communities. This differs slightly from a pure event-first platform but creates strong alignment for most growth features.

### Already Implemented

| Capability | Status | Location |
|------------|--------|----------|
| Events model | ✅ | `prisma/schema.prisma` — Event, EventRsvp |
| Community-scoped events | ✅ | `app/dashboard/community/[slug]/events/` |
| RSVP tracking | ✅ | EventRsvp model with status (going, etc.) |
| Analytics event schema | ✅ | `lib/analytics/events.ts` |
| Event ingestion API | ✅ | `app/api/events/route.ts` |
| Email infrastructure | ✅ | `lib/email/` — templates, queue, worker |
| Chat / AI assistant | ✅ | `app/components/ChatWidget.tsx`, `app/api/chat/route.ts` |

### Gaps vs. Event Growth Strategy

| Feature | Status | Notes |
|---------|--------|-------|
| AI-powered social sharing | ❌ | Needs share prompts post-RSVP, Open Graph for events |
| Referral program with AI matching | ❌ | No referral codes; event recommendations not implemented |
| SEO for events (AI-assisted) | ❌ | No event detail pages with meta/structured data |
| Smart event reminders | ❌ | Email infra exists; no reminder scheduling |
| AI-curated event digests | ❌ | No digest generation; recommendation engine not built |
| AI re-engagement campaigns | ❌ | No churn prediction or at-risk user logic |
| AI networking suggestions | ❌ | No attendee matching or profile data for events |
| Gamification (badges, challenges) | ❌ | No challenge or badge system |
| Event-specific analytics events | ❌ | Need `event_viewed`, `event_rsvpd`, `event_shared` |

### Recommended Event Analytics Events

To support the metrics in the Growth Strategy, extend the analytics schema with:

- `event_viewed` — user_id, event_id, community_id, time_on_page_seconds
- `event_rsvpd` — user_id, event_id, status (going, interested, etc.)
- `event_shared` — user_id, event_id, platform (twitter, facebook, etc.)
- `community_joined` — user_id, community_id (for Community Join Rate)

### Implementation Priority

1. **Event analytics** — Add event-specific tracking events; wire RSVP/create flows.
2. **SEO for events** — Public event pages with meta tags and Schema.org.
3. **AI-powered sharing** — Share prompts and `event_shared` tracking post-RSVP.
4. **Smart reminders** — Use existing email queue for reminder scheduling.
5. **Referral + AI matching** — Referral codes; AI event recommendations for referred users.
