import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { searchPosts } from "@/lib/ai/rag";

const PLATFORM_KNOWLEDGE = `
You are a helpful, friendly guide for the AI Community Platform. You answer questions about the platform and help users navigate features, pricing, and use cases.

## Platform Overview
The AI Community Platform is an AI-native platform for building intelligent communities. It combines community infrastructure, knowledge management, monetization, and AI automation into a single system.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, communityId, communitySlug } = body;

    let resolvedCommunityId = communityId;
    if (!resolvedCommunityId && communitySlug) {
      const c = await prisma.community.findUnique({
        where: { slug: communitySlug },
        select: { id: true },
      });
      resolvedCommunityId = c?.id ?? undefined;
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").pop();
    const userQuery = typeof lastUserMsg?.content === "string" ? lastUserMsg.content : "";

    let systemContent = PLATFORM_KNOWLEDGE;

    if (resolvedCommunityId) {
      const community = await prisma.community.findUnique({
        where: { id: resolvedCommunityId },
        select: { name: true, description: true },
      });
      if (community) {
        systemContent += `\n\n## Current Community Context\nYou are helping users in the community "${community.name}". ${community.description ? `Description: ${community.description}` : ""}`;

        const communityPosts = await searchPosts(userQuery, {
          limit: 5,
          communityId: resolvedCommunityId,
        });

        if (communityPosts.length > 0) {
          const postContext = communityPosts
            .map(
              (p) =>
                `### Post: ${p.title}${p.spaceName ? ` (in #${p.spaceName})` : ""}\n${p.body.slice(0, 800)}${p.body.length > 800 ? "..." : ""}`
            )
            .join("\n\n---\n\n");
          systemContent += `\n\n## Relevant community discussions\nUse the following posts to answer questions about this community. Reference them when relevant (e.g. "In a recent post about X...").\n\n${postContext}`;
        }
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "I'm here to help! Ask me about communities, posts, or the platform. (AI features require configuration.)",
      });
    }

    const openai = new OpenAI({ apiKey });

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

    const reply =
      completion.choices[0]?.message?.content ??
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
