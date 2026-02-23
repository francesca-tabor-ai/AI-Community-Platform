-- AlterTable
ALTER TABLE "User" ADD COLUMN "headline" TEXT;
ALTER TABLE "User" ADD COLUMN "location" TEXT;
ALTER TABLE "User" ADD COLUMN "industry" TEXT;
ALTER TABLE "User" ADD COLUMN "openTo" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateEnum
CREATE TYPE "VibeNetConnectionStatus" AS ENUM ('pending', 'accepted', 'declined');

-- CreateTable
CREATE TABLE "VibeNetRefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VibeNetRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetConnection" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "status" "VibeNetConnectionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VibeNetConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VibeNetSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetMatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchedUserId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "reason" TEXT,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "feedback" JSONB DEFAULT '{}',

    CONSTRAINT "VibeNetMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetConversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VibeNetConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VibeNetConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VibeNetMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetOpportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "creatorId" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VibeNetOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeNetSavedOpportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VibeNetSavedOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VibeNetRefreshToken_token_key" ON "VibeNetRefreshToken"("token");
CREATE INDEX "VibeNetRefreshToken_userId_idx" ON "VibeNetRefreshToken"("userId");
CREATE UNIQUE INDEX "VibeNetConnection_fromUserId_toUserId_key" ON "VibeNetConnection"("fromUserId", "toUserId");
CREATE INDEX "VibeNetConnection_fromUserId_idx" ON "VibeNetConnection"("fromUserId");
CREATE INDEX "VibeNetConnection_toUserId_idx" ON "VibeNetConnection"("toUserId");
CREATE INDEX "VibeNetSkill_userId_idx" ON "VibeNetSkill"("userId");
CREATE UNIQUE INDEX "VibeNetMatch_userId_matchedUserId_key" ON "VibeNetMatch"("userId", "matchedUserId");
CREATE INDEX "VibeNetMatch_userId_idx" ON "VibeNetMatch"("userId");
CREATE INDEX "VibeNetMatch_computedAt_idx" ON "VibeNetMatch"("computedAt");
CREATE UNIQUE INDEX "VibeNetConversationParticipant_conversationId_userId_key" ON "VibeNetConversationParticipant"("conversationId", "userId");
CREATE INDEX "VibeNetConversationParticipant_conversationId_idx" ON "VibeNetConversationParticipant"("conversationId");
CREATE INDEX "VibeNetConversationParticipant_userId_idx" ON "VibeNetConversationParticipant"("userId");
CREATE INDEX "VibeNetMessage_conversationId_idx" ON "VibeNetMessage"("conversationId");
CREATE INDEX "VibeNetMessage_senderId_idx" ON "VibeNetMessage"("senderId");
CREATE UNIQUE INDEX "VibeNetSavedOpportunity_userId_opportunityId_key" ON "VibeNetSavedOpportunity"("userId", "opportunityId");
CREATE INDEX "VibeNetSavedOpportunity_userId_idx" ON "VibeNetSavedOpportunity"("userId");
CREATE INDEX "VibeNetSavedOpportunity_opportunityId_idx" ON "VibeNetSavedOpportunity"("opportunityId");

-- AddForeignKey
ALTER TABLE "VibeNetRefreshToken" ADD CONSTRAINT "VibeNetRefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetConnection" ADD CONSTRAINT "VibeNetConnection_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetConnection" ADD CONSTRAINT "VibeNetConnection_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetSkill" ADD CONSTRAINT "VibeNetSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetMatch" ADD CONSTRAINT "VibeNetMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetMatch" ADD CONSTRAINT "VibeNetMatch_matchedUserId_fkey" FOREIGN KEY ("matchedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetConversationParticipant" ADD CONSTRAINT "VibeNetConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "VibeNetConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetConversationParticipant" ADD CONSTRAINT "VibeNetConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetMessage" ADD CONSTRAINT "VibeNetMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "VibeNetConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetMessage" ADD CONSTRAINT "VibeNetMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetSavedOpportunity" ADD CONSTRAINT "VibeNetSavedOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VibeNetSavedOpportunity" ADD CONSTRAINT "VibeNetSavedOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "VibeNetOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
