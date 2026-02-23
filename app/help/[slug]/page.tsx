import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Placeholder content for help articles
const ARTICLES: Record<string, { title: string; content: string }> = {
  "creating-first-community": {
    title: "Creating your first community",
    content: `To create your first community:

1. Log in to your account and go to the dashboard
2. Click "Create Community"
3. Enter your community name and description
4. Choose your community settings (public, private, or invite-only)
5. Customize spaces and channels as needed

Your community will be live immediately. You can invite members and start posting.`,
  },
  "inviting-members": {
    title: "Inviting members",
    content: `You can invite members in several ways:

- Share an invite link directly
- Send email invitations from the Members section
- Enable open signup for public communities

Members can join instantly via the link or request access for invite-only communities.`,
  },
  "spaces-and-channels": {
    title: "Setting up spaces and channels",
    content: `Spaces are top-level containers; channels live inside spaces.

1. Go to Community Settings > Structure
2. Create spaces (e.g., "General", "Announcements", "Discussions")
3. Add channels within each space
4. Set permissions per space or channel if needed`,
  },
  "customizing-community": {
    title: "Customizing your community",
    content: `Customize your community under Settings > Appearance. You can change the logo, colors, and branding. Advanced customization is available on higher plans.`,
  },
  "ai-assistant-overview": {
    title: "AI Assistant overview",
    content: `The AI Assistant helps members find answers, get recommendations, and navigate your community. It uses your community's content to provide accurate, relevant responses. Configure it in Settings > AI Assistant.`,
  },
  "configuring-ai": {
    title: "Configuring AI responses",
    content: `Configure AI behavior in Settings > AI Assistant. You can set tone, scope, and fallback behavior. Advanced plans allow custom training on your knowledge base.`,
  },
  "knowledge-search": {
    title: "Knowledge discovery and search",
    content: `Our AI-powered search indexes all community content. Members can find relevant posts, discussions, and resources quickly. Enable in Settings > Knowledge.`,
  },
  "automated-moderation": {
    title: "Automated moderation",
    content: `AI moderation helps flag spam, abuse, and policy violations. Configure rules and sensitivity in Settings > Moderation. Human review is always available.`,
  },
  "paid-memberships": {
    title: "Setting up paid memberships",
    content: `Go to Settings > Monetization to set up paid tiers. Define pricing, benefits, and access levels. Payment processing is built in.`,
  },
  "courses": {
    title: "Creating and selling courses",
    content: `Create courses under the Courses section. Add lessons, set pricing, and publish. Members can enroll and access content based on their membership.`,
  },
  "events": {
    title: "Managing events",
    content: `Create events in the Events section. Set date, time, capacity, and pricing. Members can RSVP and receive reminders.`,
  },
  "payments-payouts": {
    title: "Payments and payouts",
    content: `We use Stripe for payments. Connect your account in Settings > Payments. Payouts are automated based on your schedule.`,
  },
  "roles-permissions": {
    title: "Roles and permissions",
    content: `Create custom roles in Settings > Roles. Assign permissions for moderation, content, and admin actions.`,
  },
  "moderation-tools": {
    title: "Moderation tools",
    content: `Moderate from the Moderation dashboard. Review flagged content, take action, and manage bans. AI assistance is available.`,
  },
  "analytics": {
    title: "Analytics and insights",
    content: `View engagement, growth, and content performance in the Analytics section. Export data for deeper analysis.`,
  },
  "exporting-data": {
    title: "Exporting data",
    content: `Export your community data from Settings > Data. Choose format and scope. Available on Pro and above.`,
  },
  "account-security": {
    title: "Account security",
    content: `Enable 2FA, manage sessions, and review login history in Settings > Security.`,
  },
  "sso-enterprise": {
    title: "SSO and enterprise auth",
    content: `Enterprise plans support Single Sign-On via SAML or OIDC. Contact sales to configure.`,
  },
  "privacy-compliance": {
    title: "Privacy and compliance",
    content: `We are GDPR-ready and follow best practices. Configure data retention and privacy settings in Settings.`,
  },
  "api-keys": {
    title: "API keys and integrations",
    content: `Generate API keys in Settings > Developers (Business plan and above). Use for integrations and automation.`,
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Help Center`,
    description: article.content.slice(0, 160),
  };
}

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <article className="mx-auto max-w-3xl px-6 py-32">
        <Link
          href="/help"
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          ← Back to Help Center
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-10 space-y-6 whitespace-pre-line text-slate-400">
          {article.content.split("\n\n").map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </article>

      <section className="border-t border-slate-800/50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-slate-500">Was this helpful?</p>
          <div className="mt-4 flex gap-4">
            <button className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 hover:border-teal-500/50 hover:text-teal-400">
              Yes
            </button>
            <button className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 hover:border-teal-500/50 hover:text-teal-400">
              No
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
