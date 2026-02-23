-- CreateEnum
CREATE TYPE "ApiUserRole" AS ENUM ('creator', 'reader');

-- CreateEnum
CREATE TYPE "CreatorSubscriptionStatus" AS ENUM ('active', 'cancelled');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "role" "ApiUserRole";
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateTable
CREATE TABLE "CreatorPost" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorPostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorPostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorSubscription" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "status" "CreatorSubscriptionStatus" NOT NULL DEFAULT 'active',
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "CreatorSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorPost_creatorId_idx" ON "CreatorPost"("creatorId");
CREATE INDEX "CreatorPost_status_publishedAt_idx" ON "CreatorPost"("status", "publishedAt");
CREATE INDEX "CreatorPostComment_postId_idx" ON "CreatorPostComment"("postId");
CREATE INDEX "CreatorPostComment_userId_idx" ON "CreatorPostComment"("userId");
CREATE INDEX "CreatorPostComment_parentCommentId_idx" ON "CreatorPostComment"("parentCommentId");
CREATE UNIQUE INDEX "CreatorSubscription_subscriberId_creatorId_key" ON "CreatorSubscription"("subscriberId", "creatorId");
CREATE INDEX "CreatorSubscription_subscriberId_idx" ON "CreatorSubscription"("subscriberId");
CREATE INDEX "CreatorSubscription_creatorId_idx" ON "CreatorSubscription"("creatorId");

-- AddForeignKey
ALTER TABLE "CreatorPost" ADD CONSTRAINT "CreatorPost_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorPostComment" ADD CONSTRAINT "CreatorPostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatorPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorPostComment" ADD CONSTRAINT "CreatorPostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorPostComment" ADD CONSTRAINT "CreatorPostComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "CreatorPostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorSubscription" ADD CONSTRAINT "CreatorSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorSubscription" ADD CONSTRAINT "CreatorSubscription_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
