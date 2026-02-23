# UX Event Platform — Implementation Roadmap

> Maps the [UX/UI Designer: AI-Augmented Event Platform Design](./UX-UI-Designer-AI-Augmented-Event-Platform-Design.md) spec to the current AI Community Platform and prioritizes implementation.

## Platform Context

The AI Community Platform is **community-centric**: events belong to communities. The UX spec describes an **event-first** experience (personalized feed, event discovery, AI assistant for events). Implementation requires bridging both: communities remain the source of events, while new flows surface events for discovery and personalization.

---

## Alignment Matrix

### User Flow 1: Onboarding & Personalized Event Discovery

| Spec Element | Current State | Gap | Notes |
|--------------|---------------|-----|-------|
| Welcome screen with value prop | Marketing home (`app/page.tsx`) | Partial | Homepage exists; no event-specific value prop |
| Sign up / Log in | ✅ `app/login`, `app/signup` | None | Ready |
| Interest selection (AI-driven) | ❌ None | **Gap** | Profile has no `interests`; no onboarding step |
| Location preference | ❌ Profile has no location | **Gap** | Need `UserPreference` or extend `Profile` |
| Personalized event feed | ❌ No event feed on homepage | **Gap** | Events exist per-community only |
| Event interaction (browse, RSVP, feedback) | Partial | **Gap** | RSVP exists; no feedback (thumbs up/down) |
| AI learning from interactions | ❌ No recommendation engine | **Gap** | Analytics events exist; no ML pipeline |

### User Flow 2: AI-Assisted Event Creation

| Spec Element | Current State | Gap | Notes |
|--------------|---------------|-----|-------|
| Create Event section | ✅ `app/dashboard/community/[slug]/events` | Partial | Exists; no AI flows |
| Basic event details (type, date, time, location) | ✅ Event model, API | None | `Event` has all fields |
| AI Title/Description/Agenda | ❌ None | **Gap** | Need "AI Generate" + OpenAI integration |
| AI Pricing strategy | ❌ No pricing on events | **Gap** | Event model has no ticket/price; needs schema |
| AI Promotional content | ❌ None | **Gap** | New feature |
| Review & Publish | Partial | **Gap** | Publish exists; no multi-step wizard |

### User Flow 3: AI Assistant for Events

| Spec Element | Current State | Gap | Notes |
|--------------|---------------|-----|-------|
| AI Assistant access | ✅ `ChatWidget` | Partial | Exists but platform-focused, not event-focused |
| Event discovery queries | ❌ Chat knows platform, not events | **Gap** | Extend `/api/chat` with event context |
| Event listings in responses | ❌ None | **Gap** | Need event search + structured responses |
| Actionable buttons (RSVP, Add to Calendar) | ❌ None | **Gap** | Need rich message format |

---

## Wireframe Alignment

### 1. Homepage / Personalized Event Feed

| Component | Status | Location |
|-----------|--------|----------|
| Header (logo, search, avatar, AI icon) | ✅ | `Header.tsx`; add event search |
| Event feed (card-based) | ❌ | New: `RecommendationFeed`, `EventCard` |
| Event card (image, title, date, location, RSVP, feedback) | ❌ | New component |
| Filters/sort bar | ❌ | New |
| Footer | ✅ | `Footer.tsx` |

### 2. Event Detail Page

| Component | Status | Location |
|-----------|--------|----------|
| Hero (image, title, date, location, organizer) | Partial | Events page is list view; no public event detail |
| Description, agenda, speakers | ❌ | Event has description; no agenda/speakers schema |
| RSVP / Get Tickets (sticky) | Partial | RSVP exists in community events |
| AI-related events | ❌ | New |
| Add to Calendar (AI conflict detection) | ❌ | New |

### 3. Event Creation Form (AI-Assisted)

| Component | Status | Location |
|-----------|--------|----------|
| Multi-step form with progress | ❌ | Current form is single-step |
| AI Generate buttons | ❌ | New |
| AI suggestion display (editable) | ❌ | New |
| AI Suggest Pricing | ❌ | New; requires pricing schema |

### 4. AI Assistant Chat

| Component | Status | Location |
|-----------|--------|----------|
| Chat window (modal/full-screen) | ✅ | `ChatWidget` |
| User/AI message differentiation | ✅ | Present |
| Event-aware responses | ❌ | Extend chat API |
| Actionable buttons in responses | ❌ | New message format |

---

## Schema Additions (Suggested)

```prisma
// User interests for event recommendations
model UserEventPreference {
  id        String   @id @default(cuid())
  userId    String
  interests String[] // e.g. ["Music", "Tech", "Sports"]
  location  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)
}

// Event feedback for AI learning
model EventFeedback {
  id       String   @id @default(cuid())
  eventId  String
  userId   String
  type     String   // "dismiss", "interested", "not_interested", "attended"
  createdAt DateTime @default(now())
  ...
}

// Optional: Event pricing (if paid events)
model EventTicket {
  id       String   @id @default(cuid())
  eventId  String
  name     String   // "Early Bird", "General"
  price    Decimal?
  quantity Int?
  ...
}
```

---

## Implementation Phases

### Phase 1: Foundation (2–3 weeks)

1. **User preferences**
   - Add `UserEventPreference` or extend `Profile` with `interests`, `eventLocation`
   - Create onboarding step after signup: interest selection + location
   - API: `GET/PATCH /api/user/preferences`

2. **Public event discovery**
   - New route: `/events` (or `/explore/events`) — cross-community event listing
   - API: `GET /api/events` with filters (date, category, location)
   - Event card component with image, title, date, location, RSVP

3. **Event detail page**
   - New route: `/events/[id]` — public event page
   - Hero, description, RSVP section
   - Reuse or adapt community event layout

### Phase 2: AI-Assisted Event Creation (2–3 weeks)

1. **Multi-step event form**
   - Convert current create-event flow into steps
   - Progress indicator component

2. **AI generation**
   - "AI Generate" for title, description, agenda
   - New API: `POST /api/ai/generate-event-content` (OpenAI)
   - Editable suggestion UI

3. **Pricing (optional for V1)**
   - Add `EventTicket` if paid events required
   - "AI Suggest Pricing" — can defer to Phase 3

### Phase 3: AI Assistant for Events (2 weeks)

1. **Event-aware chat**
   - Extend `/api/chat` with event context (user preferences, event search)
   - Update `PLATFORM_KNOWLEDGE` to include event queries
   - Chat probes: "Find events this week", "Recommend events near me"

2. **Actionable responses**
   - Structured responses with event IDs
   - Buttons: "View event", "RSVP", "Add to calendar"
   - May require custom message format in `ChatWidget`

### Phase 4: Personalization & Learning (3+ weeks)

1. **Recommendation feed**
   - `GET /api/events/recommended` — hybrid logic (interests + location + behavior)
   - Homepage section: "Recommended for you"

2. **Feedback mechanism**
   - Thumbs up/down or "Not interested" on event cards
   - Store in `EventFeedback` for future ML

3. **AI learning pipeline**
   - Analytics events: `event_viewed`, `event_rsvpd`, `event_feedback`
   - Optional: embeddings, collaborative filtering (larger scope)

---

## Cross-References

| Document | Purpose |
|----------|---------|
| [Product Manager: Personalized Event Feed](./Product%20Manager%3A%20AI-Augmented%20Event%20Platform%20Specifications%20-%20Personalized%20Event%20Feed.md) | PRD for feed, acceptance criteria |
| [Implementation-Alignment](./Implementation-Alignment.md) | Event growth features, analytics |
| [Chief Product Officer: Event Platform Strategy](./Chief%20Product%20Officer%3A%20AI-Augmented%20Event%20Platform%20Strategy.md) | Strategic context |

---

## Quick Wins (Immediate)

1. Add event discovery probes to `ChatWidget` (e.g. "Find events near me")
2. Extend chat API to query events and include in responses
3. Create `/events` listing page (no personalization yet)
4. Add "AI Generate" button to event title/description in create form (single API call)
