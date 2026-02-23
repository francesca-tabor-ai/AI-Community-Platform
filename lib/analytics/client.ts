/**
 * Client-side analytics tracking SDK
 * Captures context (platform, device, browser, session) and sends events to /api/events
 */

import type { AnalyticsEvent } from "./events";

const SESSION_KEY = "analytics_session_id";

function generateId(): string {
  return crypto.randomUUID?.() ?? `gen-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return generateId();
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = generateId();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function detectPlatform(): "web" | "mobile_ios" | "mobile_android" {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "mobile_ios";
  if (/android/.test(ua)) return "mobile_android";
  return "web";
}

function detectDeviceType(): "desktop" | "tablet" | "phone" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|phone|android(?!.*tablet)|iphone|ipod/.test(ua)) return "phone";
  if (/ipad|android.*tablet|tablet/.test(ua)) return "tablet";
  return "desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  let name = "Unknown";
  let version = "";
  if (ua.includes("Chrome") && !ua.includes("Edg")) {
    name = "Chrome";
    const m = ua.match(/Chrome\/(\d+)/);
    version = m ? m[1] : "";
  } else if (ua.includes("Firefox")) {
    name = "Firefox";
    const m = ua.match(/Firefox\/(\d+)/);
    version = m ? m[1] : "";
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    name = "Safari";
    const m = ua.match(/Version\/(\d+)/);
    version = m ? m[1] : "";
  } else if (ua.includes("Edg")) {
    name = "Edge";
    const m = ua.match(/Edg\/(\d+)/);
    version = m ? m[1] : "";
  }
  return version ? `${name} ${version}` : name;
}

function detectOS(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || /iphone|ipad|ipod/.test(ua.toLowerCase())) return "iOS";
  return "unknown";
}

export type BaseContext = {
  user_id: string | null;
};

function buildBasePayload<E extends AnalyticsEvent>(event: E): E {
  const base = {
    event_id: generateId(),
    timestamp: new Date().toISOString(),
    session_id: getOrCreateSessionId(),
    platform: detectPlatform(),
    device_type: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    referrer_url: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    page_url: typeof window !== "undefined" ? window.location.href : undefined,
  };
  return { ...event, ...base } as E;
}

export async function trackClientEvent<E extends AnalyticsEvent>(
  event: Omit<E, "event_id" | "timestamp" | "session_id" | "platform" | "device_type" | "browser" | "os"> & Partial<Pick<E, "event_id" | "timestamp" | "session_id" | "platform" | "device_type" | "browser" | "os">>,
  userId?: string | null
): Promise<void> {
  const enriched = buildBasePayload({
    ...event,
    user_id: userId ?? (event as { user_id?: string | null }).user_id ?? null,
  } as E);

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    });
    if (!res.ok) {
      console.warn("[analytics] Event rejected:", res.status, await res.text());
    }
  } catch (err) {
    console.warn("[analytics] Failed to send event:", err);
  }
}

// Convenience methods for each event type
export const analytics = {
  userRegistered: (props: {
    user_id: string;
    email: string;
    username?: string;
    role: "creator" | "reader";
    registration_source?: string;
  }) =>
    trackClientEvent({
      event_name: "user_registered",
      ...props,
    }),

  userLoggedIn: (props: {
    user_id: string;
    login_method: "email_password" | "google_oauth" | "github" | "other";
  }) =>
    trackClientEvent({
      event_name: "user_logged_in",
      ...props,
    }),

  postViewed: (props: {
    user_id?: string | null;
    post_id: string;
    creator_id: string;
    post_title?: string;
    time_on_page_seconds?: number;
    scroll_depth_percentage?: number;
  }) =>
    trackClientEvent({
      event_name: "post_viewed",
      ...props,
      user_id: props.user_id ?? null,
    }),

  postPublished: (props: {
    user_id: string;
    post_id: string;
    post_title: string;
    post_type: "article" | "newsletter" | "post";
  }) =>
    trackClientEvent({
      event_name: "post_published",
      ...props,
    }),

  commentSubmitted: (props: {
    user_id: string;
    post_id: string;
    comment_id: string;
    parent_comment_id?: string;
  }) =>
    trackClientEvent({
      event_name: "comment_submitted",
      ...props,
    }),

  creatorSubscribed: (props: {
    subscriber_id: string;
    creator_id: string;
    subscription_type: "free" | "paid";
    tier_name?: string;
    user_id?: string | null;
  }) =>
    trackClientEvent({
      event_name: "creator_subscribed",
      user_id: props.subscriber_id,
      ...props,
    }),

  paymentSucceeded: (props: {
    user_id: string;
    creator_id: string;
    subscription_id: string;
    amount: number;
    currency: string;
    payment_method_type: "card" | "paypal" | "other";
    is_renewal: boolean;
  }) =>
    trackClientEvent({
      event_name: "payment_succeeded",
      ...props,
    }),

  // Event Platform: User Engagement
  profileUpdated: (props: { user_id: string; updated_fields: string[] }) =>
    trackClientEvent({ event_name: "profile_updated", ...props }),

  interestSelected: (props: { user_id: string; interest_name: string }) =>
    trackClientEvent({ event_name: "interest_selected", ...props }),

  searchPerformed: (props: {
    user_id?: string | null;
    search_query: string;
    search_results_count: number;
  }) => trackClientEvent({ event_name: "search_performed", ...props, user_id: props.user_id ?? null }),

  // Event Platform: Event Discovery
  eventViewed: (props: {
    user_id?: string | null;
    community_event_id: string;
    source: "personalized_feed" | "search_results" | "direct_link" | "community_page" | "other";
  }) =>
    trackClientEvent({
      event_name: "event_viewed",
      ...props,
      user_id: props.user_id ?? null,
    }),

  eventCardClicked: (props: {
    user_id?: string | null;
    community_event_id: string;
    position_in_feed?: number;
  }) =>
    trackClientEvent({
      event_name: "event_card_clicked",
      ...props,
      user_id: props.user_id ?? null,
    }),

  recommendationFeedbackProvided: (props: {
    user_id?: string | null;
    community_event_id: string;
    feedback_type: "like" | "dislike" | "more_like_this";
  }) =>
    trackClientEvent({
      event_name: "recommendation_feedback_provided",
      ...props,
      user_id: props.user_id ?? null,
    }),

  // Event Platform: Event Interaction
  rsvpClicked: (props: { user_id: string; community_event_id: string }) =>
    trackClientEvent({ event_name: "rsvp_clicked", ...props }),

  rsvpConfirmed: (props: {
    user_id: string;
    community_event_id: string;
    rsvp_status: "going" | "attending" | "interested" | "maybe" | "not_going";
  }) => trackClientEvent({ event_name: "rsvp_confirmed", ...props }),

  ticketSelected: (props: {
    user_id: string;
    community_event_id: string;
    ticket_type: string;
    quantity: number;
  }) => trackClientEvent({ event_name: "ticket_selected", ...props }),

  checkoutInitiated: (props: {
    user_id: string;
    community_event_id: string;
    total_amount: number;
  }) => trackClientEvent({ event_name: "checkout_initiated", ...props }),

  ticketPurchased: (props: {
    user_id: string;
    community_event_id: string;
    ticket_id: string;
    amount: number;
    currency: string;
    payment_method: string;
  }) => trackClientEvent({ event_name: "ticket_purchased", ...props }),

  addToCalendarClicked: (props: {
    user_id?: string | null;
    community_event_id: string;
    calendar_type: "google" | "outlook" | "apple" | "other";
  }) =>
    trackClientEvent({
      event_name: "add_to_calendar_clicked",
      ...props,
      user_id: props.user_id ?? null,
    }),

  // Event Platform: Organizer Events (typically server-side)
  eventCreated: (props: {
    organizer_id: string;
    community_event_id: string;
    event_category?: string;
    is_paid: boolean;
  }) =>
    trackClientEvent({
      event_name: "event_created",
      user_id: props.organizer_id,
      ...props,
    }),

  eventUpdated: (props: {
    organizer_id: string;
    community_event_id: string;
    updated_fields: string[];
  }) =>
    trackClientEvent({
      event_name: "event_updated",
      user_id: props.organizer_id,
      ...props,
    }),

  aiContentGenerated: (props: {
    organizer_id: string;
    community_event_id: string;
    content_type: "title" | "description" | "agenda" | "other";
    ai_model_used?: string;
  }) =>
    trackClientEvent({
      event_name: "ai_content_generated",
      user_id: props.organizer_id,
      ...props,
    }),

  promotionalContentGenerated: (props: {
    organizer_id: string;
    community_event_id: string;
    channel: "facebook" | "email" | "twitter" | "linkedin" | "other";
    ai_model_used?: string;
  }) =>
    trackClientEvent({
      event_name: "promotional_content_generated",
      user_id: props.organizer_id,
      ...props,
    }),
};
