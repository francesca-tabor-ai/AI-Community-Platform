-- CreateTable
CREATE TABLE "CreatorStripeSubscription" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "subscriberEmail" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorStripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorStripeSubscription_stripeSubscriptionId_key" ON "CreatorStripeSubscription"("stripeSubscriptionId");
CREATE INDEX "CreatorStripeSubscription_creatorId_idx" ON "CreatorStripeSubscription"("creatorId");
CREATE INDEX "CreatorStripeSubscription_subscriberEmail_idx" ON "CreatorStripeSubscription"("subscriberEmail");

-- AddForeignKey
ALTER TABLE "CreatorStripeSubscription" ADD CONSTRAINT "CreatorStripeSubscription_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
