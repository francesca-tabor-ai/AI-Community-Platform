require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const dbUrl = process.env.DATABASE_URL || "";
if (dbUrl.includes("railway.internal")) {
  console.error(
    "\n❌ DATABASE_URL uses postgres.railway.internal, which is only reachable from within Railway.\n" +
      "   For local seeding, use the PUBLIC database URL from your Railway dashboard.\n" +
      "   (PostgreSQL service → Variables or Connect → copy the public URL)\n"
  );
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (optional - comment out for additive seeding)
  await prisma.platformEventRsvp.deleteMany();
  await prisma.platformEvent.deleteMany();
  await prisma.creatorPostComment.deleteMany();
  await prisma.creatorPost.deleteMany();
  await prisma.creatorSubscription.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.eventRsvp.deleteMany();
  await prisma.event.deleteMany();
  await prisma.member.deleteMany();
  await prisma.space.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionTier.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.community.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await hash("demo1234", 10);

  // Users
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Chen",
      username: "alice",
      role: "creator",
      password: hashedPassword,
      profile: {
        create: {
          displayName: "Alice Chen",
          bio: "Community builder and AI enthusiast.",
          isCreator: true,
          creatorTagline: "Building the future of communities",
        },
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob Martinez",
      username: "bob",
      role: "reader",
      password: hashedPassword,
      profile: {
        create: {
          displayName: "Bob Martinez",
          bio: "Developer and open source advocate.",
          isCreator: false,
        },
      },
    },
  });

  const carol = await prisma.user.create({
    data: {
      email: "carol@example.com",
      name: "Carol Williams",
      username: "carol",
      role: "creator",
      password: hashedPassword,
      profile: {
        create: {
          displayName: "Carol Williams",
          bio: "Product leader and community strategist.",
          isCreator: true,
          creatorTagline: "Scaling communities with AI",
        },
      },
    },
  });

  // Community
  const community = await prisma.community.create({
    data: {
      name: "AI Builders",
      slug: "ai-builders",
      description:
        "A community for developers, creators, and innovators building with AI. Share ideas, get feedback, and grow together.",
      visibility: "public",
      ownerId: alice.id,
      spaces: {
        create: [
          {
            name: "General",
            slug: "general",
            description: "General discussion and announcements",
            type: "general",
          },
          {
            name: "Announcements",
            slug: "announcements",
            description: "Community updates and news",
            type: "announcements",
          },
          {
            name: "Q&A",
            slug: "q-and-a",
            description: "Ask questions and get answers",
            type: "questions",
          },
        ],
      },
    },
    include: { spaces: true },
  });

  // Members
  await prisma.member.createMany({
    data: [
      { userId: alice.id, communityId: community.id, role: "owner" },
      { userId: bob.id, communityId: community.id, role: "moderator" },
      { userId: carol.id, communityId: community.id, role: "member" },
    ],
  });

  const generalSpace = community.spaces.find((s) => s.slug === "general");

  // Posts
  const welcomePost = await prisma.post.create({
    data: {
      spaceId: generalSpace.id,
      communityId: community.id,
      authorId: alice.id,
      title: "Welcome to AI Builders!",
      body: "Welcome everyone! This community is for anyone building with AI—whether you're shipping products, experimenting with LLMs, or just getting started. Share your projects, ask questions, and connect with fellow builders.",
      type: "post",
      status: "published",
    },
  });

  const gettingStartedPost = await prisma.post.create({
    data: {
      spaceId: generalSpace.id,
      communityId: community.id,
      authorId: bob.id,
      title: "Getting started with AI APIs",
      body: "I've put together a quick guide for folks new to AI APIs. Here are the key steps: 1) Choose your provider (OpenAI, Anthropic, etc.), 2) Get an API key, 3) Start with simple completions. Happy to answer questions in the comments!",
      type: "article",
      status: "published",
    },
  });

  // Comments
  await prisma.comment.create({
    data: {
      postId: welcomePost.id,
      authorId: bob.id,
      body: "Excited to be here! Looking forward to learning from everyone.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: welcomePost.id,
      authorId: carol.id,
      body: "Thanks for creating this space, Alice. The AI landscape moves so fast—great to have a place to keep up.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: gettingStartedPost.id,
      authorId: alice.id,
      body: "This is super helpful. Would love to see a follow-up on prompt engineering best practices!",
    },
  });

  // Event
  const now = new Date();
  const eventStart = new Date(now);
  eventStart.setDate(eventStart.getDate() + 7);
  const eventEnd = new Date(eventStart);
  eventEnd.setHours(eventEnd.getHours() + 2);

  await prisma.event.create({
    data: {
      communityId: community.id,
      creatorId: alice.id,
      title: "AI Builders Monthly Meetup",
      description:
        "Join us for our monthly virtual meetup. We'll share updates, demo projects, and network.",
      startAt: eventStart,
      endAt: eventEnd,
      type: "online",
      location: "Zoom",
      maxAttendees: 50,
    },
  });

  // Subscription tiers
  await prisma.subscriptionTier.create({
    data: {
      communityId: community.id,
      name: "Free",
      price: 0,
      interval: "month",
      benefits: "Access to general channels and events",
    },
  });

  await prisma.subscriptionTier.create({
    data: {
      communityId: community.id,
      name: "Pro",
      price: 29,
      interval: "month",
      benefits:
        "Everything in Free plus exclusive content and priority support",
    },
  });

  // Contact submissions
  await prisma.contactSubmission.createMany({
    data: [
      {
        firstName: "Jordan",
        lastName: "Smith",
        email: "jordan@startup.io",
        company: "Startup IO",
        role: "Founder",
        inquiryType: "enterprise",
        communitySize: "1000-5000",
        message:
          "Interested in enterprise pricing for our developer community.",
        read: false,
      },
      {
        firstName: "Sam",
        lastName: "Lee",
        email: "sam@creators.co",
        inquiryType: "pricing",
        communitySize: "100-500",
        message:
          "Looking to migrate our creator community. Can you share Pro plan details?",
        read: true,
      },
    ],
  });

  // Notification
  await prisma.notification.create({
    data: {
      userId: alice.id,
      type: "new_comment",
      targetId: welcomePost.id,
      title: "New comment on your post",
      message: "Bob Martinez commented on 'Welcome to AI Builders!'",
      read: false,
    },
  });

  // Activity
  await prisma.activity.create({
    data: {
      userId: alice.id,
      type: "community_created",
      targetType: "Community",
      targetId: community.id,
      metadata: { name: community.name },
    },
  });

  console.log("✅ Seed complete!");
  console.log("\nDemo users (password: demo1234):");
  console.log("  - alice@example.com");
  console.log("  - bob@example.com");
  console.log("  - carol@example.com");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });