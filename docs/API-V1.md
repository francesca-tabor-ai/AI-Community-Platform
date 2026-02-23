# API v1 - Creator Publishing Platform

RESTful API for the Creator Publishing Platform. Base URL: `/api/v1`.

**Authentication:** All endpoints require JWT in the `Authorization: Bearer <token>` header, except `POST /users/register` and `POST /users/login`.

## User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/register` | POST | Register a new user. Body: `{email, password, username, role}`. Role: `creator` or `reader`. |
| `/users/login` | POST | Authenticate and get JWT. Body: `{email, password}`. Returns `{access_token, token_type}`. |
| `/users/{id}` | GET | Get user profile (requires auth). |
| `/users/{id}` | PUT | Update profile (own user only). Body: `{username?, bio?}`. |

## Content Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts` | POST | Create a draft post (creators only). Body: `{title, content}`. |
| `/posts/{id}` | GET | Get a post. Drafts visible only to creator. |
| `/posts/{id}` | PUT | Update a post (creator owner only). Body: `{title?, content?, status?}`. |
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
| `/creators/{creator_id}/subscribe` | POST | Subscribe to a creator. |
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
