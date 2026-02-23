-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsEvent_eventId_key" ON "AnalyticsEvent"("eventId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_idx" ON "AnalyticsEvent"("eventName");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_timestamp_idx" ON "AnalyticsEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_timestamp_idx" ON "AnalyticsEvent"("eventName", "timestamp");
