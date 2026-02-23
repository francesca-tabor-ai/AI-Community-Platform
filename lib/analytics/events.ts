/**
 * Analytics Event Schema
 * Event tracking schema for product analytics and decision-making.
 * Supports: user_registered, user_logged_in, post_viewed, post_published,
 * comment_submitted, creator_subscribed, payment_succeeded,
 * profile_updated, interest_selected, search_performed,
 * event_viewed, event_card_clicked, recommendation_feedback_provided,
 * rsvp_clicked, rsvp_confirmed, ticket_selected, checkout_initiated,
 * ticket_purchased, add_to_calendar_clicked,
 * event_created, event_updated, ai_content_generated, promotional_content_generated
 */

import { z } from "zod";

// --- Core properties (common to all events) ---

export const coreEventSchema = z.object({
  event_id: z.string(),
  event_name: z.string(),
  timestamp: z.string().datetime(),
  user_id: z.string().nullable(),
  session_id: z.string(),
  platform: z.enum(["web", "mobile_ios", "mobile_android"]),
  device_type: z.enum(["desktop", "tablet", "phone"]),
  browser: z.string(),
  os: z.string(),
  referrer: z.string().optional(),
  referrer_url: z.string().optional(),
  page_url: z.string().optional(),
  ip_address: z.string().optional(),
});

// --- Specific event payloads ---

export const userRegisteredSchema = coreEventSchema.extend({
  event_name: z.literal("user_registered"),
  email: z.string().email(),
  username: z.string().optional(),
  role: z.enum(["creator", "reader"]),
  registration_source: z.string().optional(),
});

export const userLoggedInSchema = coreEventSchema.extend({
  event_name: z.literal("user_logged_in"),
  login_method: z.enum(["email_password", "google_oauth", "github", "other"]),
});

export const postViewedSchema = coreEventSchema.extend({
  event_name: z.literal("post_viewed"),
  post_id: z.string(),
  creator_id: z.string(),
  post_title: z.string().optional(),
  time_on_page_seconds: z.number().optional(),
  scroll_depth_percentage: z.number().min(0).max(100).optional(),
});

export const postPublishedSchema = coreEventSchema.extend({
  event_name: z.literal("post_published"),
  post_id: z.string(),
  post_title: z.string(),
  post_type: z.enum(["article", "newsletter", "post"]),
});

export const commentSubmittedSchema = coreEventSchema.extend({
  event_name: z.literal("comment_submitted"),
  post_id: z.string(),
  comment_id: z.string(),
  parent_comment_id: z.string().optional(),
});

export const creatorSubscribedSchema = coreEventSchema.extend({
  event_name: z.literal("creator_subscribed"),
  subscriber_id: z.string(),
  creator_id: z.string(),
  subscription_type: z.enum(["free", "paid"]),
  tier_name: z.string().optional(),
});

export const paymentSucceededSchema = coreEventSchema.extend({
  event_name: z.literal("payment_succeeded"),
  creator_id: z.string(),
  subscription_id: z.string(),
  amount: z.number(),
  currency: z.string().length(3),
  payment_method_type: z.enum(["card", "paypal", "other"]),
  is_renewal: z.boolean(),
});

// --- Union type for all events ---

export const analyticsEventSchema = z.discriminatedUnion("event_name", [
  userRegisteredSchema,
  userLoggedInSchema,
  postViewedSchema,
  postPublishedSchema,
  commentSubmittedSchema,
  creatorSubscribedSchema,
  paymentSucceededSchema,
]);

export type CoreEventProperties = z.infer<typeof coreEventSchema>;
export type UserRegisteredEvent = z.infer<typeof userRegisteredSchema>;
export type UserLoggedInEvent = z.infer<typeof userLoggedInSchema>;
export type PostViewedEvent = z.infer<typeof postViewedSchema>;
export type PostPublishedEvent = z.infer<typeof postPublishedSchema>;
export type CommentSubmittedEvent = z.infer<typeof commentSubmittedSchema>;
export type CreatorSubscribedEvent = z.infer<typeof creatorSubscribedSchema>;
export type PaymentSucceededEvent = z.infer<typeof paymentSucceededSchema>;

export type AnalyticsEvent =
  | UserRegisteredEvent
  | UserLoggedInEvent
  | PostViewedEvent
  | PostPublishedEvent
  | CommentSubmittedEvent
  | CreatorSubscribedEvent
  | PaymentSucceededEvent;

export const EVENT_NAMES = [
  "user_registered",
  "user_logged_in",
  "post_viewed",
  "post_published",
  "comment_submitted",
  "creator_subscribed",
  "payment_succeeded",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
