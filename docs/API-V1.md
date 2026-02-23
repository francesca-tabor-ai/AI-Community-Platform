# API v1 - Creator Publishing & AI-Augmented Event Platform

RESTful API. Base URL: `/api/v1`.

**Authentication:** JWT in `Authorization: Bearer <token>` header. Exceptions: `POST /users`, `POST /users/register`, `POST /users/login`, `POST /auth/login`, `POST /auth/register`.

---

## AI-Augmented Event Platform

### User Service
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users` | POST | Create user. Body: `{username, email, password, first_name?, last_name?}`. |
| `/users/me` | GET | Get current user profile. |
| `/users/me` | PUT | Update profile. Body: `{username?, first_name?, last_name?, profile_picture_url?}`. |
| `/auth/login` | POST | Login. Body: `{email, password}`. Returns `{access_token, token_type}`. |

### Event Service
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/events` | POST | Create event. Body: `{name?, title?, description?, start_date?, end_date?, start_time?, end_time?, location?, ticket_price?, capacity?, rules?, settings?}`. Returns `{event_id, message}`. |
| `/events` | GET | List events. Query: `from`, `to`, `limit`, `offset`. |
| `/events/{eventId}` | GET | Get event details. |
| `/events/{eventId}` | PUT | Update event (organizer only). Returns `{event_id, message}`. |
| `/events/{eventId}` | DELETE | Delete event (organizer only). |
| `/events/{eventId}/publish` | POST | Publish event (organizer only). Returns `{event_id, message}`. |
| `/events/{eventId}/ai-generate-content` | POST | Trigger AI content generation (organizer only). Body: `{content_type}`. Returns `{task_id, message}`. |
| `/events/{eventId}/rsvp` | POST | RSVP. Body: `{status?: "attending"\|"interested"}`. |
| `/events/{eventId}/judges` | POST | Add judge (organizer only). Body: `{user_id}`. |
| `/events/{eventId}/submissions` | POST | Submit project. Body: `{team_id?, title, description?, submission_url?, files?}`. Returns `{submission_id, message}`. |
| `/events/{eventId}/submissions/{submissionId}` | GET | Get submission details. |
| `/events/{eventId}/submissions/{submissionId}/score` | POST | Submit score (judge only). Body: `{criteria_id, score, comments?}`. Returns `{score_id, message}`. |
| `/events/{eventId}/submissions/{submissionId}/ai-evaluate` | POST | Trigger AI evaluation (organizer/judge). Returns `{task_id, message}`. |
| `/events/{eventId}/teams` | POST | Create team (organizer only). Body: `{name, description?}`. Returns `{team_id, message}`. |
| `/events/{eventId}/teams/{teamId}/join` | POST | Join team. Returns `{message}`. |
| `/events/{eventId}/teams/{teamId}/invite` | POST | Invite user to team. Body: `{user_id}`. Returns `{message}`. |
| `/events/{eventId}/ai-team-recommendations` | GET | Get AI-powered team recommendations. Returns `{recommendations: [{user_id, score}]}`. |

### Community Service
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/communities` | POST | Create community. Body: `{name, description?}`. |
| `/communities` | GET | List public communities. Query: `limit`, `offset`. |
| `/communities/{communityId}` | GET | Get community. |
| `/communities/{communityId}/join` | POST | Join community. |

### Recommendation Service
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/recommendations/events` | GET | Personalized event recommendations. |

---

## Creator Publishing Platform

## User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register a new creator. Body: `{email, password, name}`. Returns `201 {user, token}`. |
| `/auth/login` | POST | Authenticate and get JWT. Body: `{email, password}`. Returns `200 {user, token}`. |
| `/users/register` | POST | Register a new user. Body: `{email, password, username, role}`. Role: `creator` or `reader`. |
| `/users/login` | POST | Authenticate and get JWT. Body: `{email, password}`. Returns `{access_token, token_type}`. |
| `/users/{id}` | GET | Get user profile (requires auth). |
| `/users/{id}` | PUT | Update profile (own user only). Body: `{username?, bio?}`. |

## Content Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts` | GET | List posts for the authenticated creator. Returns `200 [post1, post2, ...]`. |
| `/posts` | POST | Create a draft post (creators only). Body: `{title, content?}`. Returns `201 {post}`. |
| `/posts/{id}` | GET | Get a post. Drafts visible only to creator. Returns `200 {post}`. |
| `/posts/{id}` | PUT | Update a post (creator owner only). Body: `{title?, content?, status?}`. Returns `200 {post}`. |
| `/posts/{id}/publish` | POST | Publish a draft (creator owner only). Triggers notification job. |
| `/creators/{creator_id}/posts` | GET | List creator's posts. Query: `status`, `limit`, `offset`. |

## Comment Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts/{post_id}/comments` | POST | Add comment. Body: `{content, parent_comment_id?}`. |
| `/posts/{post_id}/comments` | GET | List comments. Query: `limit`, `offset`. |

## Subscription Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscriptions/subscribe` | POST | Create a paid subscription via Stripe. Body: `{creatorId, stripeToken}`. Returns `201 {subscription}`. Requires auth. |
| `/creators/{creator_id}/subscribe` | POST | Subscribe to a creator (free follow). |
| `/creators/{creator_id}/unsubscribe` | POST | Unsubscribe from a creator. |
| `/users/{user_id}/subscriptions` | GET | List user's subscriptions (own user only). |

## Error Response Format

```json
{
  "detail": "Human-readable error message",
  "code": "ERROR_CODE",
  "field_errors": {
    "field_name": "Field-specific error"
  }
}
```

## Environment Variables

- `JWT_SECRET` – Secret for signing JWTs (defaults to `AUTH_SECRET` if unset)
- `STRIPE_SECRET_KEY` – Stripe API key for paid subscriptions
- `STRIPE_DEFAULT_PRICE_ID` – Default Stripe Price ID for creator subscriptions (MVP)
