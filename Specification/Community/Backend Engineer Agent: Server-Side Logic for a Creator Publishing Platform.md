
# Backend Engineer Agent: Server-Side Logic for a Creator Publishing Platform

## API Endpoint Specifications

All APIs will be RESTful, using JSON for request and response bodies, and authenticated via JWTs in the `Authorization: Bearer <token>` header. Base URL: `/api/v1`.

### 1. User Management

| Endpoint                 | Method | Description                                  | Request Body                                   | Response Body                                  |
| :----------------------- | :----- | :------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- |
| `/users/register`        | `POST` | Register a new user                          | `{email, password, username, role}`            | `{id, email, username, role, created_at}`      |
| `/users/login`           | `POST` | Authenticate user and return JWT             | `{email, password}`                            | `{access_token, token_type}`                   |
| `/users/{id}`            | `GET`  | Get user profile by ID                       | None                                           | `{id, email, username, bio, role, created_at}` |
| `/users/{id}`            | `PUT`  | Update user profile                          | `{username?, bio?}`                            | `{id, email, username, bio, role, updated_at}` |

### 2. Content Management

| Endpoint                 | Method | Description                                  | Request Body                                   | Response Body                                  |
| :----------------------- | :----- | :------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- |
| `/posts`                 | `POST` | Create a new post (draft)                    | `{title, content}`                             | `{id, creator_id, title, status, created_at}`  |
| `/posts/{id}`            | `GET`  | Get a single post by ID                      | None                                           | `{id, creator_id, title, content, status, published_at}` |
| `/posts/{id}`            | `PUT`  | Update an existing post                      | `{title?, content?, status?}`                  | `{id, creator_id, title, content, status, updated_at}` |
| `/posts/{id}/publish`    | `POST` | Publish a draft post                         | None                                           | `{id, creator_id, title, content, status, published_at}` |
| `/creators/{creator_id}/posts` | `GET`  | Get all posts by a specific creator          | None (query params: `status`, `limit`, `offset`)| `[{id, title, status, published_at}, ...]`     |

### 3. Comment Management

| Endpoint                 | Method | Description                                  | Request Body                                   | Response Body                                  |
| :----------------------- | :----- | :------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- |
| `/posts/{post_id}/comments` | `POST` | Add a comment to a post                      | `{content, parent_comment_id?}`                | `{id, post_id, user_id, content, created_at}`  |
| `/posts/{post_id}/comments` | `GET`  | Get comments for a post                      | None (query params: `limit`, `offset`)         | `[{id, user_id, content, created_at}, ...]`    |

### 4. Subscription Management

| Endpoint                 | Method | Description                                  | Request Body                                   | Response Body                                  |
| :----------------------- | :----- | :------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- |
| `/creators/{creator_id}/subscribe` | `POST` | Subscribe to a creator                       | None                                           | `{id, subscriber_id, creator_id, status}`      |
| `/creators/{creator_id}/unsubscribe` | `POST` | Unsubscribe from a creator                   | None                                           | `{id, subscriber_id, creator_id, status}`      |
| `/users/{user_id}/subscriptions` | `GET`  | Get subscriptions for a user                 | None                                           | `[{id, creator_id, status, subscribed_at}, ...]` |

## Database Models

Using an ORM (e.g., SQLAlchemy for Python, Sequelize for Node.js) to define models that map to the PostgreSQL schema.

### User Model
```python
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    role = Column(Enum("creator", "reader"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    posts = relationship("Post", back_populates="creator")
    comments = relationship("Comment", back_populates="user")
    subscriptions_as_subscriber = relationship("Subscription", foreign_keys="[Subscription.subscriber_id]", back_populates="subscriber")
    subscriptions_as_creator = relationship("Subscription", foreign_keys="[Subscription.creator_id]", back_populates="creator")
```

### Post Model
```python
class Post(Base):
    __tablename__ = "posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False) # Stored as HTML or Markdown
    status = Column(Enum("draft", "published"), default="draft", nullable=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post")
```

### Comment Model
```python
class Comment(Base):
    __tablename__ = "comments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey("comments.id"), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    parent_comment = relationship("Comment", remote_side=[id])
    replies = relationship("Comment", back_populates="parent_comment", cascade="all, delete-orphan")
```

### Subscription Model
```python
class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscriber_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum("active", "cancelled"), default="active", nullable=False)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    cancelled_at = Column(DateTime, nullable=True)

    subscriber = relationship("User", foreign_keys=[subscriber_id], back_populates="subscriptions_as_subscriber")
    creator = relationship("User", foreign_keys=[creator_id], back_populates="subscriptions_as_creator")
```

## Service Logic Design

Each API endpoint will correspond to a function in the respective service. Logic will be encapsulated within these service functions, interacting with the database via the ORM.

### Example: `create_post` function in Content Service

1.  **Authentication & Authorization:** Verify JWT, ensure the user is a `creator`.
2.  **Input Validation:** Validate `title` and `content` (e.g., not empty, max length).
3.  **Database Interaction:** Create a new `Post` object with `creator_id`, `title`, `content`, and default `status` as `draft`.
4.  **Response:** Return the newly created post object.

### Example: `publish_post` function in Content Service

1.  **Authentication & Authorization:** Verify JWT, ensure the user is the `creator_id` of the post.
2.  **Input Validation:** Ensure the post exists and is currently a `draft`.
3.  **Database Interaction:** Update `Post` status to `published` and set `published_at` timestamp.
4.  **Asynchronous Task Trigger:** Send a message to the message queue (e.g., RabbitMQ) to trigger the `send_new_post_notifications` background job.
5.  **Response:** Return the updated post object.

## Background Job Architecture

Background jobs will handle long-running or asynchronous tasks to avoid blocking API responses and improve user experience. A message queue will be used to decouple producers (API services) from consumers (worker processes).

*   **Message Queue:** RabbitMQ (or similar).
*   **Worker Processes:** Dedicated worker applications (e.g., Celery for Python) that listen to specific queues.

### Key Background Jobs:

1.  **`send_new_post_notifications`:**
    *   **Trigger:** When a post is published.
    *   **Payload:** `post_id`.
    *   **Logic:**
        *   Retrieve post details and creator information.
        *   Fetch all subscribers for the `creator_id`.
        *   For each subscriber, construct an email and send it via the Email Service.
        *   Handle rate limiting and retries for email sending.

2.  **`process_analytics_event`:**
    *   **Trigger:** When an analytics event occurs (e.g., `post_view`).
    *   **Payload:** `event_type`, `user_id`, `post_id`, `timestamp`.
    *   **Logic:**
        *   Persist the event data to an analytics data store (e.g., a separate NoSQL database or a data warehouse).
        *   Aggregate metrics (e.g., increment `view_count` for a post).

## Error Handling Strategy

Consistent and informative error handling is crucial for both API consumers and internal debugging.

### 1. HTTP Status Codes
*   Use standard HTTP status codes to indicate the nature of the error (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).

### 2. Standardized Error Response Body
*   All error responses will return a JSON object with a consistent structure.

```json
{
  "detail": "A human-readable explanation of the error.",
  "code": "OPTIONAL_MACHINE_READABLE_ERROR_CODE",
  "field_errors": {
    "field_name": "Specific error message for this field."
  }
}
```

### 3. Centralized Error Handling
*   Implement a global error handler in the API gateway or application framework to catch unhandled exceptions and return standardized error responses.

### 4. Logging
*   Log all errors with sufficient detail (stack traces, request context) to a centralized logging system (e.g., ELK stack, Datadog).
*   Assign unique correlation IDs to requests to trace them across services.

### 5. Input Validation
*   Perform input validation at the API boundary to catch invalid data early and return `400 Bad Request` errors.

### 6. Graceful Degradation & Retries
*   For external service calls (e.g., Email Service), implement retry mechanisms with exponential backoff.
*   Design services to degrade gracefully if a dependency is unavailable (e.g., if analytics service is down, core publishing should still function).
