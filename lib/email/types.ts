/**
 * Email queue message types.
 * Matches the specification: email_type, recipient_email, recipient_name, template_data, metadata
 */

export type EmailType =
  | "new_post_notification"
  | "welcome"
  | "subscription_confirmation"
  | "subscription_cancelled"
  | "payment_failed"
  | "event_reminder"
  | "comment_reply"
  | "mention";

export interface EmailMessage {
  email_type: EmailType;
  recipient_email: string;
  recipient_name?: string;
  template_data: Record<string, unknown>;
  metadata?: {
    user_id?: string;
    post_id?: string;
    community_id?: string;
    event_id?: string;
    subscription_id?: string;
    [key: string]: string | undefined;
  };
}

export interface NewPostNotificationData {
  creator_name: string;
  post_title: string;
  post_url: string;
  community_name?: string;
}

export interface WelcomeData {
  user_name: string;
  login_url?: string;
}

export interface SubscriptionConfirmationData {
  subscriber_name: string;
  creator_name: string;
  tier_name: string;
  community_name: string;
}

export interface EventReminderData {
  event_title: string;
  event_url: string;
  start_at: string;
  creator_name?: string;
}
