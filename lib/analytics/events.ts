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

// --- Event Platform: User Engagement ---

export const profileUpdatedSchema = coreEventSchema.extend({
  event_name: z.literal("profile_updated"),
  updated_fields: z.array(z.string()),
});

export const interestSelectedSchema = coreEventSchema.extend({
  event_name: z.literal("interest_selected"),
  interest_name: z.string(),
});

export const searchPerformedSchema = coreEventSchema.extend({
  event_name: z.literal("search_performed"),
  search_query: z.string(),
  search_results_count: z.number(),
});

// --- Event Platform: Event Discovery ---

export const eventViewedSchema = coreEventSchema.extend({
  event_name: z.literal("event_viewed"),
  community_event_id: z.string(),
  source: z.enum(["personalized_feed", "search_results", "direct_link", "community_page", "other"]),
});

export const eventCardClickedSchema = coreEventSchema.extend({
  event_name: z.literal("event_card_clicked"),
  community_event_id: z.string(),
  position_in_feed: z.number().optional(),
});

export const recommendationFeedbackProvidedSchema = coreEventSchema.extend({
  event_name: z.literal("recommendation_feedback_provided"),
  community_event_id: z.string(),
  feedback_type: z.enum(["like", "dislike", "more_like_this"]),
});

// --- Event Platform: Event Interaction ---

export const rsvpClickedSchema = coreEventSchema.extend({
  event_name: z.literal("rsvp_clicked"),
  community_event_id: z.string(),
});

export const rsvpConfirmedSchema = coreEventSchema.extend({
  event_name: z.literal("rsvp_confirmed"),
  community_event_id: z.string(),
  rsvp_status: z.enum(["going", "attending", "interested", "maybe", "not_going"]),
});

export const ticketSelectedSchema = coreEventSchema.extend({
  event_name: z.literal("ticket_selected"),
  community_event_id: z.string(),
  ticket_type: z.string(),
  quantity: z.number(),
});

export const checkoutInitiatedSchema = coreEventSchema.extend({
  event_name: z.literal("checkout_initiated"),
  community_event_id: z.string(),
  total_amount: z.number(),
});

export const ticketPurchasedSchema = coreEventSchema.extend({
  event_name: z.literal("ticket_purchased"),
  community_event_id: z.string(),
  ticket_id: z.string(),
  amount: z.number(),
  currency: z.string(),
  payment_method: z.string(),
});

export const addToCalendarClickedSchema = coreEventSchema.extend({
  event_name: z.literal("add_to_calendar_clicked"),
  community_event_id: z.string(),
  calendar_type: z.enum(["google", "outlook", "apple", "other"]),
});

// --- Event Platform: Organizer Events ---

export const eventCreatedSchema = coreEventSchema.extend({
  event_name: z.literal("event_created"),
  organizer_id: z.string(),
  community_event_id: z.string(),
  event_category: z.string().optional(),
  is_paid: z.boolean(),
});

export const eventUpdatedSchema = coreEventSchema.extend({
  event_name: z.literal("event_updated"),
  organizer_id: z.string(),
  community_event_id: z.string(),
  updated_fields: z.array(z.string()),
});

export const aiContentGeneratedSchema = coreEventSchema.extend({
  event_name: z.literal("ai_content_generated"),
  organizer_id: z.string(),
  community_event_id: z.string(),
  content_type: z.enum(["title", "description", "agenda", "other"]),
  ai_model_used: z.string().optional(),
});

export const promotionalContentGeneratedSchema = coreEventSchema.extend({
  event_name: z.literal("promotional_content_generated"),
  organizer_id: z.string(),
  community_event_id: z.string(),
  channel: z.enum(["facebook", "email", "twitter", "linkedin", "other"]),
  ai_model_used: z.string().optional(),
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
  profileUpdatedSchema,
  interestSelectedSchema,
  searchPerformedSchema,
  eventViewedSchema,
  eventCardClickedSchema,
  recommendationFeedbackProvidedSchema,
  rsvpClickedSchema,
  rsvpConfirmedSchema,
  ticketSelectedSchema,
  checkoutInitiatedSchema,
  ticketPurchasedSchema,
  addToCalendarClickedSchema,
  eventCreatedSchema,
  eventUpdatedSchema,
  aiContentGeneratedSchema,
  promotionalContentGeneratedSchema,
]);

export type CoreEventProperties = z.infer<typeof coreEventSchema>;
export type UserRegisteredEvent = z.infer<typeof userRegisteredSchema>;
export type UserLoggedInEvent = z.infer<typeof userLoggedInSchema>;
export type PostViewedEvent = z.infer<typeof postViewedSchema>;
export type PostPublishedEvent = z.infer<typeof postPublishedSchema>;
export type CommentSubmittedEvent = z.infer<typeof commentSubmittedSchema>;
export type CreatorSubscribedEvent = z.infer<typeof creatorSubscribedSchema>;
export type PaymentSucceededEvent = z.infer<typeof paymentSucceededSchema>;
export type ProfileUpdatedEvent = z.infer<typeof profileUpdatedSchema>;
export type InterestSelectedEvent = z.infer<typeof interestSelectedSchema>;
export type SearchPerformedEvent = z.infer<typeof searchPerformedSchema>;
export type EventViewedEvent = z.infer<typeof eventViewedSchema>;
export type EventCardClickedEvent = z.infer<typeof eventCardClickedSchema>;
export type RecommendationFeedbackProvidedEvent = z.infer<typeof recommendationFeedbackProvidedSchema>;
export type RsvpClickedEvent = z.infer<typeof rsvpClickedSchema>;
export type RsvpConfirmedEvent = z.infer<typeof rsvpConfirmedSchema>;
export type TicketSelectedEvent = z.infer<typeof ticketSelectedSchema>;
export type CheckoutInitiatedEvent = z.infer<typeof checkoutInitiatedSchema>;
export type TicketPurchasedEvent = z.infer<typeof ticketPurchasedSchema>;
export type AddToCalendarClickedEvent = z.infer<typeof addToCalendarClickedSchema>;
export type EventCreatedEvent = z.infer<typeof eventCreatedSchema>;
export type EventUpdatedEvent = z.infer<typeof eventUpdatedSchema>;
export type AiContentGeneratedEvent = z.infer<typeof aiContentGeneratedSchema>;
export type PromotionalContentGeneratedEvent = z.infer<typeof promotionalContentGeneratedSchema>;

export type AnalyticsEvent =
  | UserRegisteredEvent
  | UserLoggedInEvent
  | PostViewedEvent
  | PostPublishedEvent
  | CommentSubmittedEvent
  | CreatorSubscribedEvent
  | PaymentSucceededEvent
  | ProfileUpdatedEvent
  | InterestSelectedEvent
  | SearchPerformedEvent
  | EventViewedEvent
  | EventCardClickedEvent
  | RecommendationFeedbackProvidedEvent
  | RsvpClickedEvent
  | RsvpConfirmedEvent
  | TicketSelectedEvent
  | CheckoutInitiatedEvent
  | TicketPurchasedEvent
  | AddToCalendarClickedEvent
  | EventCreatedEvent
  | EventUpdatedEvent
  | AiContentGeneratedEvent
  | PromotionalContentGeneratedEvent;

export const EVENT_NAMES = [
  "user_registered",
  "user_logged_in",
  "post_viewed",
  "post_published",
  "comment_submitted",
  "creator_subscribed",
  "payment_succeeded",
  "profile_updated",
  "interest_selected",
  "search_performed",
  "event_viewed",
  "event_card_clicked",
  "recommendation_feedback_provided",
  "rsvp_clicked",
  "rsvp_confirmed",
  "ticket_selected",
  "checkout_initiated",
  "ticket_purchased",
  "add_to_calendar_clicked",
  "event_created",
  "event_updated",
  "ai_content_generated",
  "promotional_content_generated",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
