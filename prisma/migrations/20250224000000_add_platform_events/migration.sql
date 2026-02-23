-- CreateEnum
CREATE TYPE "PlatformEventRsvpStatus" AS ENUM ('attending', 'interested');

-- CreateTable
CREATE TABLE "PlatformEvent" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "ticketPrice" DECIMAL(10,2),
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEventRsvp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "PlatformEventRsvpStatus" NOT NULL DEFAULT 'attending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformEventRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlatformEvent_organizerId_idx" ON "PlatformEvent"("organizerId");
CREATE INDEX "PlatformEvent_startTime_idx" ON "PlatformEvent"("startTime");
CREATE UNIQUE INDEX "PlatformEventRsvp_userId_eventId_key" ON "PlatformEventRsvp"("userId", "eventId");
CREATE INDEX "PlatformEventRsvp_eventId_idx" ON "PlatformEventRsvp"("eventId");
CREATE INDEX "PlatformEventRsvp_userId_idx" ON "PlatformEventRsvp"("userId");

-- AddForeignKey
ALTER TABLE "PlatformEvent" ADD CONSTRAINT "PlatformEvent_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventRsvp" ADD CONSTRAINT "PlatformEventRsvp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlatformEventRsvp" ADD CONSTRAINT "PlatformEventRsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PlatformEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
