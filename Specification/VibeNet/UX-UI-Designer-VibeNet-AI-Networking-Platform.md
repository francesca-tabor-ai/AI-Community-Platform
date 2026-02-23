# Agent 08 — UX/UI Designer
## Platform: VibeNet — AI-Powered Professional Networking

---

## Design Philosophy

**Dark Futurist / Neo-Brutalist Intelligence** — a visual language communicating technological sophistication, exclusivity, and AI working on the user's behalf.

**Core Principles:**
1. Intelligence made visible — AI reasoning always surfaced, never hidden
2. Signal over noise — ruthless information hierarchy
3. Earned complexity — simple by default, detailed on demand
4. Kinetic precision — motion that informs, not decorates

**Color Philosophy:**
- Deep obsidian background — premium, focus, exclusivity
- Electric indigo primary — intelligence, trust, technology
- Neon emerald accent — growth, opportunity, success

**Typography System:**
- Display: Space Grotesk — geometric, modern, distinctive
- Body: Inter — readable, neutral, professional
- Data: JetBrains Mono — precision, technical credibility

---

## User Flows

### Onboarding Flow
```
Landing Page
  → Sign Up (email + password)
  → Profile Step 1: Basic Info (name, headline, location)
  → Profile Step 2: Skills (min 3, autocomplete)
  → Profile Step 3: Goals (open to: roles/cofounders/investors)
  → "Your AI is finding matches..." (loading animation)
  → First Match Reveal (top 3 matches)
  → Dashboard
```
Design principle: Deliver "wow moment" (first matches) before profile is complete.

### Match Discovery Flow
```
Dashboard → Match Card (hover: reveal AI reason)
  → Click: Match Detail Panel slides in
  → Review: name, role, AI reason, mutual connections
  → Action: Connect (primary) or Dismiss (secondary)
  → Connection request sent → conversation started
```

### Opportunity Discovery Flow
```
Dashboard → Opportunity Feed (sorted by AI fit score)
  → Click: Opportunity Detail expands inline
  → Review: title, company, salary, AI fit reason
  → Action: Save (bookmark) or Apply (external link)
```

---

## Wireframes (Described)

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] [Dashboard] [Matches] [Opportunities] [Messages] │
├──────────────────────────────────────┬──────────────────┤
│  Stats Row (4 cards)                 │  AI Insight Card │
│  Top AI Matches (list)               │  Activity Feed   │
│  Matched Opportunities (list)        │  Network Health  │
└──────────────────────────────────────┴──────────────────┘
```

### Messaging Layout
```
┌────────────────┬──────────────────────────────────────── │
│ Conversations  │ Chat Header (name, role, match score)   │
│ [Conv 1] ●     │ [Message bubbles]                       │
│ [Conv 2]       │ AI Suggestions (chips)                  │
│ [Conv 3]       │ [Message Input] [Send]                  │
└────────────────┴──────────────────────────────────────── │
```

---

## Component Hierarchy

**Cards:**
- Match Card: 72px avatar, name/role, match score ring, AI reason block, hover-reveal actions
- Opportunity Card: Company initials, title + type badge, salary + location, AI fit score bar
- Message Preview: 40px avatar, name + role, last message truncated, timestamp, unread badge

**AI Components:**
- AI Reason Block: indigo-tinted background, Brain icon, 1–3 sentence explanation
- AI Score Display: large gradient number + "MATCH" label in mono font
- AI Suggestion Chips: rounded pills, dismissable, click-to-fill message input

---

## UX Principles

1. **Transparency:** Always show why the AI made a recommendation
2. **Progressive disclosure:** Surface most important information first
3. **Feedback loops:** Every interaction improves the AI — make this visible
4. **Accessibility:** WCAG 2.1 AA compliance, keyboard navigable, 4.5:1 contrast ratio
