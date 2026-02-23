import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostViewTracker } from "@/app/components/PostViewTracker";

const POSTS: Record<
  string,
  { title: string; date: string; category: string; content: string }
> = {
  "introducing-ai-community-platform": {
    title: "Introducing the AI Community Platform",
    date: "2024-02-15",
    category: "Product",
    content: `We're building the first AI-native platform designed to power communities at scale. 

Communities have long been the backbone of learning, innovation, and human connection. But today's platforms treat them as passive containers—places to host content and discussions with minimal intelligence.

We believe communities should be alive. They should answer questions, surface knowledge, moderate themselves, and grow with the help of AI.

That's why we built the AI Community Platform from the ground up with AI at its core. We're just getting started, and we can't wait to show you what's next.`,
  },
  "how-ai-transforms-community-engagement": {
    title: "How AI Transforms Community Engagement",
    date: "2024-02-10",
    category: "Best Practices",
    content: `Discover how AI can automate moderation, personalize content, and keep members engaged—without the manual effort.

Community managers spend countless hours answering the same questions, moderating discussions, and trying to surface relevant content. AI can handle much of this automatically.

Our AI assistant answers member questions 24/7, guides users to relevant discussions, summarizes long threads, and provides personalized recommendations. The result? Higher engagement, less burnout, and communities that scale.`,
  },
  "monetizing-your-community": {
    title: "Monetizing Your Community: A Complete Guide",
    date: "2024-02-05",
    category: "Monetization",
    content: `From paid memberships to courses and events, learn the strategies top creators use to build sustainable revenue from their communities.

The key is to start with value. Offer something your audience can't get elsewhere—exclusive content, direct access to you, courses, or events. Then choose the right monetization model: memberships, subscriptions, one-time purchases, or a mix.

Our platform supports all of these natively. You can set up paid tiers, sell courses, host paid events, and gate premium content—all with built-in payment processing.`,
  },
  "enterprise-community-security": {
    title: "Enterprise-Grade Security for Communities",
    date: "2024-01-28",
    category: "Security",
    content: `What enterprises need to know about securing large-scale communities: SSO, RBAC, encryption, and compliance.

When you're managing communities with thousands or millions of members, security isn't optional. Enterprises need Single Sign-On, role-based access control, encryption at rest and in transit, and compliance with regulations like GDPR.

Our Enterprise plan is designed for these requirements. We offer dedicated infrastructure, advanced security controls, and enterprise compliance support.`,
  },
  "ai-assistant-best-practices": {
    title: "AI Assistant Best Practices for Community Support",
    date: "2024-01-20",
    category: "AI",
    content: `Reduce support load and improve member experience with AI-powered answers, recommendations, and automated assistance.

The best AI assistants are trained on your community's knowledge. They answer questions based on your content, direct users to relevant discussions, and escalate complex issues to humans when needed.

Configure your AI to match your tone, scope, and policies. Start with common questions, then expand as you learn what members ask most.`,
  },
  "scaling-from-100-to-10000-members": {
    title: "Scaling from 100 to 10,000+ Members",
    date: "2024-01-12",
    category: "Growth",
    content: `Lessons from communities that grew 100x: structure, engagement strategies, and when to automate.

Structure matters early. Define clear spaces and channels. Use roles to empower power users. Establish norms and moderation guidelines before you scale.

Engagement strategies that work: welcome sequences, regular content, events, and AI-powered personalization. Automate what you can so you can focus on what matters.`,
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | AI Community Platform Blog`,
    description: post.content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PostViewTracker
        postId={slug}
        creatorId="platform"
        postTitle={post.title}
      >
      <article className="mx-auto max-w-3xl px-6 py-32">
        <Link
          href="/blog"
          className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
        >
          ← Back to Blog
        </Link>
        <span className="mt-4 block text-sm font-medium text-violet-600">
          {post.category}
        </span>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-slate-600">{post.date}</p>
        <div className="mt-10 space-y-6 whitespace-pre-line text-lg leading-relaxed text-slate-600">
          {post.content.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
      </PostViewTracker>

      <section className="border-t border-slate-200 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Link
            href="/blog"
            className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            ← Back to all posts
          </Link>
        </div>
      </section>
    </div>
  );
}
