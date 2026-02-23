/**
 * Email template renderer.
 * Generates HTML for each email type with consistent branding and unsubscribe link.
 */

import type { EmailType } from "../types";
import { getUnsubscribeUrl } from "../esp";

// Base layout wrapper
function layout(content: string, preheader?: string): string {
  const preheaderTag = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${preheaderTag}
  <title>AI Community Platform</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f8fafc;color:#0f172a;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;">
      ${content}
      <div style="padding:24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center;">
        <p style="margin:0 0 8px 0;">You received this email because you're part of our community.</p>
        <p style="margin:0;"><a href="{{UNSUBSCRIBE_URL}}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a></p>
      </div>
    </div>
  </div>
</body>
</html>`.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ctaButton(text: string, url: string): string {
  return `
    <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#ffffff !important;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">${escapeHtml(text)}</a>
  `.trim();
}

export interface RenderOptions {
  recipientEmail: string;
  recipientName?: string;
}

export function renderEmail(
  emailType: EmailType,
  templateData: Record<string, unknown>,
  options: RenderOptions
): { subject: string; html: string } {
  const unsubscribeUrl = getUnsubscribeUrl(options.recipientEmail);
  const name = options.recipientName || "there";

  switch (emailType) {
    case "new_post_notification":
      return renderNewPostNotification(templateData, name, unsubscribeUrl);
    case "welcome":
      return renderWelcome(templateData, name, unsubscribeUrl);
    case "subscription_confirmation":
      return renderSubscriptionConfirmation(templateData, name, unsubscribeUrl);
    case "subscription_cancelled":
      return renderSubscriptionCancelled(templateData, name, unsubscribeUrl);
    case "event_reminder":
      return renderEventReminder(templateData, name, unsubscribeUrl);
    default:
      return renderGeneric(templateData, emailType, name, unsubscribeUrl);
  }
}

function renderNewPostNotification(
  data: Record<string, unknown>,
  name: string,
  unsubscribeUrl: string
): { subject: string; html: string } {
  const creator = (data.creator_name as string) || "A creator";
  const title = (data.post_title as string) || "New post";
  const url = (data.post_url as string) || "#";
  const community = (data.community_name as string) | undefined;

  const subject = `${creator} published: ${title}`;
  const content = `
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#0f172a;">Hi ${escapeHtml(name)},</h1>
      <p style="margin:0 0 16px 0;color:#475569;line-height:1.6;">
        ${escapeHtml(creator)} just published a new post${community ? ` in ${escapeHtml(community)}` : ""}.
      </p>
      <h2 style="margin:0 0 16px 0;font-size:18px;color:#0f172a;">${escapeHtml(title)}</h2>
      <p style="margin:0 0 24px 0;">
        ${ctaButton("Read post", url)}
      </p>
    </div>
  `;

  const html = layout(content, title).replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl);
  return { subject, html };
}

function renderWelcome(
  data: Record<string, unknown>,
  name: string,
  unsubscribeUrl: string
): { subject: string; html: string } {
  const loginUrl = (data.login_url as string) || "#";

  const subject = "Welcome to AI Community Platform";
  const content = `
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#0f172a;">Welcome, ${escapeHtml(name)}!</h1>
      <p style="margin:0 0 16px 0;color:#475569;line-height:1.6;">
        Thanks for joining AI Community Platform. Connect with creators, join communities, and discover amazing content.
      </p>
      <p style="margin:0 0 24px 0;">
        ${ctaButton("Get started", loginUrl)}
      </p>
    </div>
  `;

  const html = layout(content).replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl);
  return { subject, html };
}

function renderSubscriptionConfirmation(
  data: Record<string, unknown>,
  name: string,
  unsubscribeUrl: string
): { subject: string; html: string } {
  const creator = (data.creator_name as string) || "creator";
  const tier = (data.tier_name as string) || "subscription";
  const community = (data.community_name as string) || "community";

  const subject = `You're now subscribed to ${creator}`;
  const content = `
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#0f172a;">Thanks for subscribing, ${escapeHtml(name)}!</h1>
      <p style="margin:0 0 16px 0;color:#475569;line-height:1.6;">
        You're now a paid subscriber to <strong>${escapeHtml(creator)}</strong> in ${escapeHtml(community)} (${escapeHtml(tier)}).
      </p>
      <p style="margin:0;color:#475569;">Enjoy exclusive content and perks!</p>
    </div>
  `;

  const html = layout(content).replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl);
  return { subject, html };
}

function renderSubscriptionCancelled(
  data: Record<string, unknown>,
  name: string,
  unsubscribeUrl: string
): { subject: string; html: string } {
  const creator = (data.creator_name as string) || "creator";

  const subject = `Subscription cancelled - ${creator}`;
  const content = `
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#0f172a;">Hi ${escapeHtml(name)},</h1>
      <p style="margin:0 0 16px 0;color:#475569;line-height:1.6;">
        Your subscription to ${escapeHtml(creator)} has been cancelled. You'll have access until the end of your billing period.
      </p>
      <p style="margin:0;color:#475569;">We hope to see you again!</p>
    </div>
  `;

  const html = layout(content).replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl);
  return { subject, html };
}

function renderEventReminder(
  data: Record<string, unknown>,
  name: string,
  unsubscribeUrl: string
): { subject: string; html: string } {
  const title = (data.event_title as string) || "Upcoming event";
  const url = (data.event_url as string) || "#";
  const startAt = (data.start_at as string) || "";
  const creator = (data.creator_name as string) | undefined;

  const subject = `Reminder: ${title}`;
  const content = `
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#0f172a;">Hi ${escapeHtml(name)},</h1>
      <p style="margin:0 0 16px 0;color:#475569;line-height:1.6;">
        This is a reminder that <strong>${escapeHtml(title)}</strong>${creator ? ` by ${escapeHtml(creator)}` : ""} is coming up${startAt ? ` at ${escapeHtml(startAt)}` : ""}.
      </p>
      <p style="margin:0 0 24px 0;">
        ${ctaButton("View event", url)}
      </p>
    </div>
  `;

  const html = layout(content).replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl);
  return { subject, html };
}

function renderGeneric(
  data: Record<string, unknown>,
  emailType: string,
  name: string,
  unsubscribeUrl: string
): { subject: string; html: string } {
  const subject = `Notification from AI Community Platform`;
  const content = `
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px 0;font-size:24px;color:#0f172a;">Hi ${escapeHtml(name)},</h1>
      <p style="margin:0;color:#475569;line-height:1.6;">
        You have a new notification. (Type: ${escapeHtml(emailType)})
      </p>
    </div>
  `;

  const html = layout(content).replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl);
  return { subject, html };
}
