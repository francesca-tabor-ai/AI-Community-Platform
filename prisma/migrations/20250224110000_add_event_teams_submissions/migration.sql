-- CreateEnum
CREATE TYPE "PlatformEventStatus" AS ENUM ('draft', 'published', 'active', 'completed');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "profileData" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "PlatformEvent" ADD COLUMN "status" "PlatformEventStatus" NOT NULL DEFAULT 'draft';
ALTER TABLE "PlatformEvent" ADD COLUMN "rules" JSONB DEFAULT '{}';
ALTER TABLE "PlatformEvent" ADD COLUMN "settings" JSONB DEFAULT '{}';

-- CreateTable
CREATE TABLE "PlatformEventJudge" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformEventJudge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEventTeam" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformEventTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEventTeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformEventTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEventSubmission" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamId" TEXT,
    "submitterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "submissionUrl" TEXT,
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "judgingScores" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformEventSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEventSubmissionScore" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformEventSubmissionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "insightType" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedByUserId" TEXT,

    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformEventJudge_eventId_userId_key" ON "PlatformEventJudge"("eventId", "userId");
CREATE INDEX "PlatformEventJudge_eventId_idx" ON "PlatformEventJudge"("eventId");
CREATE INDEX "PlatformEventJudge_userId_idx" ON "PlatformEventJudge"("userId");
CREATE INDEX "PlatformEventTeam_eventId_idx" ON "PlatformEventTeam"("eventId");
CREATE UNIQUE INDEX "PlatformEventTeamMember_teamId_userId_key" ON "PlatformEventTeamMember"("teamId", "userId");
CREATE INDEX "PlatformEventTeamMember_teamId_idx" ON "PlatformEventTeamMember"("teamId");
CREATE INDEX "PlatformEventTeamMember_userId_idx" ON "PlatformEventTeamMember"("userId");
CREATE INDEX "PlatformEventSubmission_eventId_idx" ON "PlatformEventSubmission"("eventId");
CREATE INDEX "PlatformEventSubmission_teamId_idx" ON "PlatformEventSubmission"("teamId");
CREATE INDEX "PlatformEventSubmission_submitterId_idx" ON "PlatformEventSubmission"("submitterId");
CREATE UNIQUE INDEX "PlatformEventSubmissionScore_submissionId_judgeId_criteriaId_key" ON "PlatformEventSubmissionScore"("submissionId", "judgeId", "criteriaId");
CREATE INDEX "PlatformEventSubmissionScore_submissionId_idx" ON "PlatformEventSubmissionScore"("submissionId");
CREATE INDEX "PlatformEventSubmissionScore_judgeId_idx" ON "PlatformEventSubmissionScore"("judgeId");
CREATE INDEX "AIInsight_entityType_entityId_idx" ON "AIInsight"("entityType", "entityId");
CREATE INDEX "AIInsight_insightType_idx" ON "AIInsight"("insightType");

-- AddForeignKey
ALTER TABLE "PlatformEventJudge" ADD CONSTRAINT "PlatformEventJudge_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PlatformEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventJudge" ADD CONSTRAINT "PlatformEventJudge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventTeam" ADD CONSTRAINT "PlatformEventTeam_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PlatformEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventTeamMember" ADD CONSTRAINT "PlatformEventTeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "PlatformEventTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventTeamMember" ADD CONSTRAINT "PlatformEventTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventSubmission" ADD CONSTRAINT "PlatformEventSubmission_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PlatformEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventSubmission" ADD CONSTRAINT "PlatformEventSubmission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "PlatformEventTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PlatformEventSubmission" ADD CONSTRAINT "PlatformEventSubmission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventSubmissionScore" ADD CONSTRAINT "PlatformEventSubmissionScore_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "PlatformEventSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventSubmissionScore" ADD CONSTRAINT "PlatformEventSubmissionScore_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AIInsight" ADD CONSTRAINT "AIInsight_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
