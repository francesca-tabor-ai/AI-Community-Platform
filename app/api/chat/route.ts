import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const PLATFORM_KNOWLEDGE = `
You are a helpful, friendly guide for the AI Community Platform. You answer questions about the platform and help users navigate features, pricing, and use cases.

## Platform Overview
The AI Community Platform is an AI-native platform for building intelligent communities. It combines community infrastructure, knowledge management, monetization, and AI automation into a single system.

## Key Features
- **AI Assistant**: Answer member questions automatically, explain content, guide users to discussions, provide personalized recommendations, summarize posts
- **Community Management**: Spaces, channels, posts, discussions, comments, roles, permissions, notifications
- **Knowledge Engine**: AI-powered search, automatic summaries, structured knowledge discovery, related content suggestions
- **Monetization**: Paid memberships, subscription tiers, paid courses, paid events, premium content access
- **AI Automation**: AI moderation, spam detection, automated onboarding, AI content suggestions, engagement prompts
- **Discovery and Recommendations**: Personalized content feed, community recommendations, member and event recommendations
- **Analytics and Insights**: Member growth, engagement metrics, content performance, revenue analytics, AI-driven insights
- **Events**: Event creation, event pages, RSVPs, event discovery and recommendations

## Pricing Plans
- **Free**: $0/mo - Up to 100 members, 1 community, basic AI assistant, basic search. Best for getting started.
- **Pro**: $29/mo ($23/mo yearly) - Up to 5,000 members, unlimited communities, advanced AI, monetization, paid memberships. Most popular. Best for creators and growing communities.
- **Business**: $99/mo ($79/mo yearly) - Unlimited members, advanced AI automation, AI moderation, events, API access, custom branding. Best for scaling organizations.
- **Enterprise**: Custom pricing - Dedicated infrastructure, SSO, SLA, dedicated support. Best for large organizations.

## Transaction Fees (when monetizing)
- Free: 5%, Pro: 3%, Business: 2%, Enterprise: Custom

## Use Cases
- **Creators**: Writers, YouTubers, influencers - monetize audience, paid memberships, courses
- **Startups**: SaaS, tech startups - customer communities, support, feedback
- **Educators**: Online schools, course creators - courses, AI tutoring, paid learning
- **Professional Communities**: Developer communities, industry groups - networking, knowledge sharing
- **Businesses/Brands**: Customer communities, brand loyalty
- **Enterprises**: Large-scale communities, structured knowledge, internal collaboration
- **Events**: Hackathons, conferences - event management, participant collaboration

## Navigation
- Features: /features
- Pricing: /pricing
- Use Cases: /use-cases
- Enterprise: /enterprise

Keep responses concise, helpful, and friendly. When relevant, guide users to specific pages (e.g., "Check out our Pricing page for full details") or suggest next steps.
`;

async function searchArticles(query: string, limit: number = 5) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();

  const { generateEmbedding, embeddingToVectorLiteral } = await import("@/lib/embeddings");
  const queryEmbedding = await generateEmbedding(q);
  if (queryEmbedding) {
    const vectorLiteral = embeddingToVectorLiteral(queryEmbedding);
    const rows = await prisma.$queryRawUnsafe<
      Array<{ slug: string; title: string; summary: string | null; body: string }>
    >(
      `SELECT slug, title, summary, body FROM "Article"
       WHERE status = 'published' AND embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector LIMIT $2`,
      vectorLiteral,
      limit
    );
    return rows;
  }

  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: {
      status: "published",
      OR: words.flatMap((word) => [
        { title: { contains: word, mode: "insensitive" as const } },
        { body: { contains: word, mode: "insensitive" as const } },
        { summary: { contains: word, mode: "insensitive" as const } },
      ]),
    },
    select: { slug: true, title: true, summary: true, body: true },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
  return articles;
}

function buildArticleContext(articles: Array<{ slug: string; title: string; summary: string | null; body: string }>): string {
  if (articles.length === 0) return "";
  const blocks = articles.map((a) => {
    const excerpt = (a.summary || a.body).slice(0, 1200);
    return `### ${a.title}\nSlug: /articles/${a.slug}\n\n${excerpt}${excerpt.length >= 1200 ? "..." : ""}`;
  });
  return `\n\n## Relevant Knowledge Base Articles\nUse the following articles to answer the user's question when relevant. Cite the article title and link (e.g., "See [Article Title](/articles/slug)").\n\n${blocks.join("\n\n---\n\n")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").pop();
    const userQuery = typeof lastUserMsg?.content === "string" ? lastUserMsg.content : "";

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback: simple keyword-based responses when OpenAI is not configured
      const reply = getFallbackReply(userQuery.toLowerCase());
      return NextResponse.json({ reply });
    }

    const openai = new OpenAI({ apiKey });

    let systemContent = PLATFORM_KNOWLEDGE;
    const relevantArticles = await searchArticles(userQuery, 5);
    if (relevantArticles.length > 0) {
      systemContent += buildArticleContext(relevantArticles);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

function getFallbackReply(query: string): string {
  const q = query.toLowerCase();

  // Pricing
  if (q.includes("pric") || q.includes("cost") || q.includes("plan") || q.includes("free")) {
    return `Our platform offers four plans:\n\nFree ($0/mo): Up to 100 members, 1 community, basic AI assistant—great for getting started.\n\nPro ($29/mo): Up to 5,000 members, advanced AI, monetization, paid memberships. Our most popular plan for creators.\n\nBusiness ($99/mo): Unlimited members, AI automation, events, API access. Best for scaling.\n\nEnterprise: Custom pricing with dedicated support and SSO.\n\nVisit our Pricing page for the full comparison!`;
  }

  // Monetization
  if (q.includes("monetiz") || q.includes("revenue") || q.includes("earn") || q.includes("paid")) {
    return `You can monetize your community with:\n• Paid memberships and subscriptions\n• Paid courses\n• Paid events\n• Premium content access\n\nMonetization is available on Pro plans and above. Transaction fees range from 5% (Free) down to 2% (Business). Enterprise has custom fees.\n\nCheck out the Pricing page for details!`;
  }

  // Features
  if (q.includes("feature") || q.includes("ai assistant") || q.includes("what can")) {
    return `The AI Community Platform includes:\n• AI Assistant - Answer questions, guide users, personalize recommendations\n• Community Management - Spaces, channels, posts, roles\n• Knowledge Engine - AI search, summaries, related content\n• Monetization - Memberships, courses, events\n• AI Automation - Moderation, spam detection, onboarding\n• Analytics - Growth, engagement, revenue insights\n\nExplore all features at /features`;
  }

  // Best for creators (check before general use cases)
  if (q.includes("best for") && q.includes("creator")) {
    return `For creators, we recommend the Pro plan ($29/mo). It includes up to 5,000 members, advanced AI, monetization tools, paid memberships, and priority support—everything you need to build and monetize your audience.\n\nCreators can create exclusive communities, offer paid memberships, sell courses, and use AI to automate engagement. See our Use Cases page for more!`;
  }

  // Use cases
  if (q.includes("use case") || q.includes("creator") || q.includes("startup") || q.includes("educator") || q.includes("enterprise")) {
    return `We support many use cases:\n• Creators - Monetize audience, paid memberships, courses\n• Startups - Customer communities, support, feedback\n• Educators - Courses, AI tutoring, paid learning\n• Enterprises - Large-scale communities, SSO, dedicated support\n\nSee all use cases at /use-cases`;
  }

  // General / what is
  if (q.includes("what is") || q.includes("what's") || q.includes("platform") || q.includes("this")) {
    return `The AI Community Platform is an AI-native platform for building intelligent communities. It combines community management, knowledge engines, monetization, and AI automation in one place.\n\nKey benefits: AI-powered engagement, monetization ready, scalable, and built for creators, startups, educators, and enterprises alike.\n\nExplore our Features and Use Cases pages to learn more!`;
  }

  // Get started
  if (q.includes("get started") || q.includes("how to start") || q.includes("start for free")) {
    return `You can get started for free—no credit card required! The Free plan includes up to 100 members, 1 community, and basic AI features.\n\nClick "Get Started Free" on our site, or visit the Pricing page to compare plans and upgrade when you're ready to grow.`;
  }

  // Default
  return `I'm here to help you learn about the AI Community Platform! Ask me about:\n• Features - AI assistant, monetization, automation, and more\n• Pricing - Free, Pro, Business, and Enterprise plans\n• Use cases - Creators, startups, educators, enterprises\n• Getting started - Free plan, no credit card needed\n\nTry "What are the pricing plans?" or "How can I monetize my community?"`;
}
