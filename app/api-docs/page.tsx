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
  GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
  POST: "bg-blue-100 text-blue-700 border-blue-200",
  PATCH: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-rose-100 text-rose-700 border-rose-200",
};

const CRUD_COLORS: Record<string, string> = {
  Create: "text-blue-600",
  Read: "text-emerald-600",
  Update: "text-amber-600",
  Delete: "text-rose-600",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            API <span className="text-gradient-accent">Documentation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            REST API reference for the AI Community Platform. Entities, endpoints, and full CRUD operations.
          </p>
          <div className="mt-8">
            <pre className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm text-slate-700">
              Base URL: <span className="text-violet-600 font-medium">/api</span> (current) · <span className="text-violet-600 font-medium">/api/v1</span> (REST)
            </pre>
          </div>
        </div>
      </section>

      {/* Entities */}
      <section id="entities" className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Entities
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Core data models in the platform. All REST endpoints operate on these entities.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ENTITIES.map((entity) => (
              <div
                key={entity.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-violet-600">{entity.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{entity.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Fields</p>
                  <p className="mt-1 font-mono text-xs text-slate-600">{entity.fields.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="endpoints" className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            API Endpoints
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            All available endpoints with HTTP method and CRUD operation. Requires{" "}
            <code className="rounded bg-violet-50 px-1.5 py-0.5 font-mono text-sm text-violet-700">Authorization: Bearer YOUR_API_KEY</code>{" "}
            for v1 endpoints.
          </p>
          <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-600">Method</th>
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-600">Path</th>
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-600">CRUD</th>
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-600">Entity</th>
                  <th className="py-4 text-left text-sm font-medium text-slate-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {REST_ENDPOINTS.map((ep, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 pr-4">
                      <span className={`inline-block rounded border px-2 py-0.5 text-xs font-mono font-semibold ${METHOD_COLORS[ep.method] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-mono text-sm text-slate-700">{ep.path}</td>
                    <td className={`py-4 pr-4 text-sm font-medium ${CRUD_COLORS[ep.crud] ?? "text-slate-600"}`}>
                      {ep.crud}
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{ep.entity ?? "—"}</td>
                    <td className="py-4 text-sm text-slate-600">
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
          <p className="mt-6 text-sm text-slate-600">
            <strong>Live now:</strong> <code className="rounded bg-slate-100 px-1 text-violet-600">/api/contact</code>, <code className="rounded bg-slate-100 px-1 text-violet-600">/api/chat</code>.
            REST v1 endpoints are documented for the planned API. API access requires Business or Enterprise plan.
          </p>
        </div>
      </section>

      {/* CRUD Summary */}
      <section id="crud" className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            CRUD Operations
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Standard REST semantics for each entity.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Create", method: "POST", color: "blue", desc: "Create a new resource" },
              { name: "Read", method: "GET", color: "emerald", desc: "Retrieve one or many resources" },
              { name: "Update", method: "PATCH", color: "amber", desc: "Partially update a resource" },
              { name: "Delete", method: "DELETE", color: "rose", desc: "Remove a resource" },
            ].map((op) => (
              <div key={op.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                <span className={`inline-block rounded border px-2 py-0.5 text-xs font-mono font-semibold ${METHOD_COLORS[op.method]}`}>
                  {op.method}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{op.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{op.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to integrate?
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Get your API key and start building.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/developers"
              className="rounded-xl bg-violet-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-violet-600"
            >
              Developer Hub
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
