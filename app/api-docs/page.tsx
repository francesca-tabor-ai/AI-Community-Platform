import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API Documentation | AI Community Platform",
  description:
    "Full API reference: entities, endpoints, and CRUD operations for the AI Community Platform REST API.",
};

const ENTITIES = [
  {
    name: "User",
    description: "Platform users with email, profile, and memberships.",
    fields: ["id", "email", "name", "image", "createdAt", "updatedAt"],
  },
  {
    name: "Profile",
    description: "Extended user profile with display name, bio, and social links.",
    fields: ["id", "userId", "displayName", "avatarUrl", "bio", "website", "twitter", "youtube", "isCreator"],
  },
  {
    name: "Community",
    description: "Communities with visibility, ownership, and monetization settings.",
    fields: ["id", "name", "slug", "description", "imageUrl", "ownerId", "visibility", "isPaid", "createdAt", "updatedAt"],
  },
  {
    name: "Space",
    description: "Channels within a community (general, announcements, questions).",
    fields: ["id", "communityId", "name", "slug", "description", "type", "createdAt", "updatedAt"],
  },
  {
    name: "Member",
    description: "Community membership with role (owner, moderator, member).",
    fields: ["id", "userId", "communityId", "role", "joinedAt"],
  },
  {
    name: "Post",
    description: "Posts and articles with type and status.",
    fields: ["id", "spaceId", "communityId", "authorId", "title", "body", "type", "status", "createdAt", "updatedAt"],
  },
  {
    name: "Comment",
    description: "Comments on posts with optional threading via parentId.",
    fields: ["id", "postId", "authorId", "body", "parentId", "createdAt", "updatedAt"],
  },
  {
    name: "Notification",
    description: "User notifications (new_comment, mention, new_post, member_join).",
    fields: ["id", "userId", "type", "targetId", "title", "message", "read", "createdAt"],
  },
  {
    name: "Event",
    description: "Events with type (online, in_person), dates, and location.",
    fields: ["id", "communityId", "creatorId", "title", "description", "startAt", "endAt", "location", "type", "maxAttendees", "createdAt", "updatedAt"],
  },
  {
    name: "EventRsvp",
    description: "User RSVP for events (going, maybe, not_going).",
    fields: ["id", "eventId", "userId", "status", "createdAt"],
  },
  {
    name: "SubscriptionTier",
    description: "Paid membership tiers for communities.",
    fields: ["id", "communityId", "name", "price", "interval", "benefits", "createdAt", "updatedAt"],
  },
  {
    name: "Subscription",
    description: "User subscriptions to community tiers.",
    fields: ["id", "subscriberId", "communityId", "tierId", "status", "currentPeriodEnd", "createdAt", "updatedAt"],
  },
  {
    name: "Activity",
    description: "User activity feed entries.",
    fields: ["id", "userId", "type", "targetType", "targetId", "metadata", "createdAt"],
  },
];

const REST_ENDPOINTS = [
  // Current live endpoints
  {
    method: "POST",
    path: "/api/contact",
    description: "Submit contact form. Sends email via Resend.",
    crud: "Create",
    body: "firstName, lastName, email, company?, role?, inquiryType, communitySize?, message",
  },
  {
    method: "POST",
    path: "/api/chat",
    description: "AI chat completion. Sends messages to OpenAI for platform Q&A.",
    crud: "Create",
    body: "messages (array of { role, content })",
  },
  // REST API (v1) - CRUD for entities
  { method: "GET", path: "/api/v1/users", entity: "User", crud: "Read", description: "List users (paginated)" },
  { method: "GET", path: "/api/v1/users/:id", entity: "User", crud: "Read", description: "Get user by ID" },
  { method: "PATCH", path: "/api/v1/users/:id", entity: "User", crud: "Update", description: "Update user" },
  { method: "GET", path: "/api/v1/profiles/:id", entity: "Profile", crud: "Read", description: "Get profile by ID" },
  { method: "PATCH", path: "/api/v1/profiles/:id", entity: "Profile", crud: "Update", description: "Update profile" },
  { method: "GET", path: "/api/v1/communities", entity: "Community", crud: "Read", description: "List communities" },
  { method: "GET", path: "/api/v1/communities/:id", entity: "Community", crud: "Read", description: "Get community by ID" },
  { method: "POST", path: "/api/v1/communities", entity: "Community", crud: "Create", description: "Create community" },
  { method: "PATCH", path: "/api/v1/communities/:id", entity: "Community", crud: "Update", description: "Update community" },
  { method: "DELETE", path: "/api/v1/communities/:id", entity: "Community", crud: "Delete", description: "Delete community" },
  { method: "GET", path: "/api/v1/communities/:id/spaces", entity: "Space", crud: "Read", description: "List spaces in community" },
  { method: "GET", path: "/api/v1/spaces/:id", entity: "Space", crud: "Read", description: "Get space by ID" },
  { method: "POST", path: "/api/v1/communities/:id/spaces", entity: "Space", crud: "Create", description: "Create space" },
  { method: "PATCH", path: "/api/v1/spaces/:id", entity: "Space", crud: "Update", description: "Update space" },
  { method: "DELETE", path: "/api/v1/spaces/:id", entity: "Space", crud: "Delete", description: "Delete space" },
  { method: "GET", path: "/api/v1/communities/:id/members", entity: "Member", crud: "Read", description: "List community members" },
  { method: "GET", path: "/api/v1/members/:id", entity: "Member", crud: "Read", description: "Get member by ID" },
  { method: "POST", path: "/api/v1/communities/:id/members", entity: "Member", crud: "Create", description: "Add member" },
  { method: "PATCH", path: "/api/v1/members/:id", entity: "Member", crud: "Update", description: "Update member role" },
  { method: "DELETE", path: "/api/v1/members/:id", entity: "Member", crud: "Delete", description: "Remove member" },
  { method: "GET", path: "/api/v1/spaces/:id/posts", entity: "Post", crud: "Read", description: "List posts in space" },
  { method: "GET", path: "/api/v1/posts/:id", entity: "Post", crud: "Read", description: "Get post by ID" },
  { method: "POST", path: "/api/v1/spaces/:id/posts", entity: "Post", crud: "Create", description: "Create post" },
  { method: "PATCH", path: "/api/v1/posts/:id", entity: "Post", crud: "Update", description: "Update post" },
  { method: "DELETE", path: "/api/v1/posts/:id", entity: "Post", crud: "Delete", description: "Delete post" },
  { method: "GET", path: "/api/v1/posts/:id/comments", entity: "Comment", crud: "Read", description: "List comments on post" },
  { method: "GET", path: "/api/v1/comments/:id", entity: "Comment", crud: "Read", description: "Get comment by ID" },
  { method: "POST", path: "/api/v1/posts/:id/comments", entity: "Comment", crud: "Create", description: "Create comment" },
  { method: "PATCH", path: "/api/v1/comments/:id", entity: "Comment", crud: "Update", description: "Update comment" },
  { method: "DELETE", path: "/api/v1/comments/:id", entity: "Comment", crud: "Delete", description: "Delete comment" },
  { method: "GET", path: "/api/v1/notifications", entity: "Notification", crud: "Read", description: "List user notifications" },
  { method: "PATCH", path: "/api/v1/notifications/:id", entity: "Notification", crud: "Update", description: "Mark notification read" },
  { method: "GET", path: "/api/v1/communities/:id/events", entity: "Event", crud: "Read", description: "List community events" },
  { method: "GET", path: "/api/v1/events/:id", entity: "Event", crud: "Read", description: "Get event by ID" },
  { method: "POST", path: "/api/v1/communities/:id/events", entity: "Event", crud: "Create", description: "Create event" },
  { method: "PATCH", path: "/api/v1/events/:id", entity: "Event", crud: "Update", description: "Update event" },
  { method: "DELETE", path: "/api/v1/events/:id", entity: "Event", crud: "Delete", description: "Delete event" },
  { method: "GET", path: "/api/v1/events/:id/rsvps", entity: "EventRsvp", crud: "Read", description: "List event RSVPs" },
  { method: "POST", path: "/api/v1/events/:id/rsvps", entity: "EventRsvp", crud: "Create", description: "Create RSVP" },
  { method: "PATCH", path: "/api/v1/rsvps/:id", entity: "EventRsvp", crud: "Update", description: "Update RSVP status" },
  { method: "GET", path: "/api/v1/communities/:id/subscription-tiers", entity: "SubscriptionTier", crud: "Read", description: "List subscription tiers" },
  { method: "GET", path: "/api/v1/subscription-tiers/:id", entity: "SubscriptionTier", crud: "Read", description: "Get tier by ID" },
  { method: "POST", path: "/api/v1/communities/:id/subscription-tiers", entity: "SubscriptionTier", crud: "Create", description: "Create subscription tier" },
  { method: "PATCH", path: "/api/v1/subscription-tiers/:id", entity: "SubscriptionTier", crud: "Update", description: "Update subscription tier" },
  { method: "DELETE", path: "/api/v1/subscription-tiers/:id", entity: "SubscriptionTier", crud: "Delete", description: "Delete subscription tier" },
  { method: "GET", path: "/api/v1/subscriptions", entity: "Subscription", crud: "Read", description: "List user subscriptions" },
  { method: "GET", path: "/api/v1/subscriptions/:id", entity: "Subscription", crud: "Read", description: "Get subscription by ID" },
  { method: "GET", path: "/api/v1/activities", entity: "Activity", crud: "Read", description: "List activity feed" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  PATCH: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  DELETE: "bg-rose-500/20 text-rose-400 border-rose-500/40",
};

const CRUD_COLORS: Record<string, string> = {
  Create: "text-blue-400",
  Read: "text-emerald-400",
  Update: "text-amber-400",
  Delete: "text-rose-400",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            API <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Documentation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            REST API reference for the AI Community Platform. Entities, endpoints, and full CRUD operations.
          </p>
          <div className="mt-8">
            <pre className="inline-block rounded-xl border border-slate-700/50 bg-slate-900/50 px-6 py-3 text-sm text-slate-300">
              Base URL: <span className="text-teal-400">/api</span> (current) · <span className="text-teal-400">/api/v1</span> (REST)
            </pre>
          </div>
        </div>
      </section>

      {/* Entities */}
      <section id="entities" className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Entities
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Core data models in the platform. All REST endpoints operate on these entities.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ENTITIES.map((entity) => (
              <div
                key={entity.name}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6"
              >
                <h3 className="font-semibold text-teal-400">{entity.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{entity.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Fields</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">{entity.fields.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="endpoints" className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            API Endpoints
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            All available endpoints with HTTP method and CRUD operation. Requires{" "}
            <code className="rounded bg-slate-700/50 px-1.5 py-0.5 text-teal-400">Authorization: Bearer YOUR_API_KEY</code>{" "}
            for v1 endpoints.
          </p>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-400">Method</th>
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-400">Path</th>
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-400">CRUD</th>
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-400">Entity</th>
                  <th className="py-4 text-left text-sm font-medium text-slate-400">Description</th>
                </tr>
              </thead>
              <tbody>
                {REST_ENDPOINTS.map((ep, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-4 pr-4">
                      <span className={`inline-block rounded border px-2 py-0.5 text-xs font-mono font-semibold ${METHOD_COLORS[ep.method] ?? "bg-slate-600/20 text-slate-400"}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-mono text-sm text-slate-300">{ep.path}</td>
                    <td className={`py-4 pr-4 text-sm font-medium ${CRUD_COLORS[ep.crud] ?? "text-slate-400"}`}>
                      {ep.crud}
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-400">{ep.entity ?? "—"}</td>
                    <td className="py-4 text-sm text-slate-400">
                      {ep.description}
                      {ep.body && (
                        <span className="mt-1 block font-mono text-xs text-slate-500">Body: {ep.body}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            <strong>Live now:</strong> <code className="text-teal-400">/api/contact</code>, <code className="text-teal-400">/api/chat</code>.
            REST v1 endpoints are documented for the planned API. API access requires Business or Enterprise plan.
          </p>
        </div>
      </section>

      {/* CRUD Summary */}
      <section id="crud" className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            CRUD Operations
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Standard REST semantics for each entity.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Create", method: "POST", color: "blue", desc: "Create a new resource" },
              { name: "Read", method: "GET", color: "emerald", desc: "Retrieve one or many resources" },
              { name: "Update", method: "PATCH", color: "amber", desc: "Partially update a resource" },
              { name: "Delete", method: "DELETE", color: "rose", desc: "Remove a resource" },
            ].map((op) => (
              <div key={op.name} className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6">
                <span className={`inline-block rounded border px-2 py-0.5 text-xs font-mono font-semibold ${METHOD_COLORS[op.method]}`}>
                  {op.method}
                </span>
                <h3 className="mt-3 font-semibold text-white">{op.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{op.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to integrate?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Get your API key and start building.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/developers"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              Developer Hub
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
