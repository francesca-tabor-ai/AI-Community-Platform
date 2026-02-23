# Technical Design: Subscriptions, Revenue Share & Tiers

> Data models, architecture, and implementation guidance for the Creator-Centric Subscription Marketplace. Aligns with [CEO Business Strategy](../Community/CEO%20Agent%3A%20Business%20Strategy%20for%20a%20Creator%20Publishing%20Platform.md) and [Payments Engineer spec](../Community/Payments%20Engineer%20Agent%3A%20Subscription%20and%20Payment%20Systems%20for%20a%20Creator%20Publishing%20Platform.md).

---

## 1. Revenue Model Mapping

### Strategy → Implementation

| Strategy Concept | Technical Implementation |
|------------------|---------------------------|
| Platform takes 10–20% of subscription revenue | `RevenueShareConfig.platformPercent` or env `PLATFORM_REVENUE_SHARE_PERCENT` |
| Creator receives 80–90% | `creatorAmount = grossAmount * (1 - platformPercent / 100)` |
| Tiered revenue share by creator volume | `CreatorTier` or `Profile.revenueShareTier` → lookup platform % |
| Creator-set subscription pricing | `SubscriptionTier.price` (in cents), `interval` (month/year) |
| Multiple tiers (basic, premium, VIP) | Multiple `SubscriptionTier` rows per `Community` |
| Freemium | `SubscriptionTier` with `price = 0` or `Community.isPaid = false` |

---

## 2. Data Model Additions

### 2.1 Revenue Share Configuration

```prisma
// Option A: Global config (simplest)
// Store in env: PLATFORM_REVENUE_SHARE_PERCENT=15

// Option B: Per-plan config (aligns with PricingClient Free/Pro/Business)
model RevenueShareTier {
  id           String   @id @default(cuid())
  planKey      String   @unique  // "free" | "pro" | "business" | "enterprise"
  platformPercent Int    // e.g. 10 = 10%
  minCreatorRevenue Int? // Optional: lower % above threshold (cents/month)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Option C: Per-creator override (for high-earners)
// Add to Profile or Community:
// revenueSharePercent Int?  // Override if set
```

### 2.2 Transaction & Earnings Tracking

```prisma
model PaymentTransaction {
  id                String   @id @default(cuid())
  stripePaymentIntentId String? @unique
  stripeInvoiceId   String?
  
  subscriberId      String
  communityId       String
  tierId            String
  
  grossAmountCents  Int      // Total charged
  platformFeeCents  Int      // Platform cut
  creatorAmountCents Int    // Net to creator
  currency         String   @default("usd")
  
  status            String   // "succeeded" | "failed" | "refunded"
  type              String   // "subscription" | "renewal" | "one_time"
  
  createdAt         DateTime @default(now())

  subscriber  User   @relation(fields: [subscriberId], references: [id])
  community   Community @relation(fields: [communityId], references: [id])
  tier        SubscriptionTier @relation(fields: [tierId], references: [id])

  @@index([communityId, createdAt])
  @@index([subscriberId])
  @@index([stripePaymentIntentId])
}

model CreatorPayout {
  id           String   @id @default(cuid())
  creatorId    String   // Community.ownerId
  communityId  String
  
  amountCents  Int
  currency     String   @default("usd")
  status       String   // "pending" | "processing" | "completed" | "failed"
  stripeTransferId String?
  stripePayoutId   String?
  
  periodStart  DateTime
  periodEnd    DateTime
  
  transactionIds Json?  // Array of PaymentTransaction ids included
  metadata      Json?
  createdAt     DateTime @default(now())
  completedAt   DateTime?

  creator   User      @relation(fields: [creatorId], references: [id])
  community Community @relation(fields: [communityId], references: [id])

  @@index([creatorId, status])
  @@index([status, createdAt])
}
```

### 2.3 Extensions to Existing Models

```prisma
// SubscriptionTier: add currency, free tier flag
model SubscriptionTier {
  // ... existing fields ...
  currency     String   @default("usd")
  isFree       Boolean  @default(false)  // Freemium: free tier
}

// Community: link to creator's platform plan for revenue share
model Community {
  // ... existing fields ...
  ownerPlanKey String?  // "free" | "pro" | "business" | "enterprise"
}
```

---

## 3. Architecture: Payment Flow

### 3.1 Subscription Checkout

```
[Reader] → Select Tier → [Frontend] → POST /api/subscriptions/checkout
  → Create Stripe Checkout Session (mode: subscription)
  → Redirect to Stripe Hosted Checkout
  → [Stripe] processes payment
  → Redirect to /subscribe/success?session_id=...
  → Frontend calls POST /api/subscriptions/confirm to create Subscription record
```

**Alternative (webhook-driven):** Rely on `checkout.session.completed` webhook to create `Subscription` and `PaymentTransaction` — more reliable.

### 3.2 Webhook Processing (Stripe)

| Event | Actions |
|-------|---------|
| `checkout.session.completed` | Create `Subscription`, `PaymentTransaction`; send confirmation email |
| `invoice.paid` | Create/update `PaymentTransaction`; update `Subscription.currentPeriodEnd` |
| `invoice.payment_failed` | Mark subscription `past_due`; trigger dunning; send email |
| `customer.subscription.deleted` | Set `Subscription.status = cancelled`; revoke access at period end |

**Idempotency:** Use `stripePaymentIntentId` or `stripeInvoiceId` as unique key; skip if already processed.

### 3.3 Revenue Share Calculation

```typescript
function calculateRevenueShare(
  grossAmountCents: number,
  creatorPlanKey: string
): { platformFeeCents: number; creatorAmountCents: number } {
  const platformPercent = getPlatformPercent(creatorPlanKey); // e.g. 15
  const platformFeeCents = Math.round(grossAmountCents * (platformPercent / 100));
  const creatorAmountCents = grossAmountCents - platformFeeCents;
  return { platformFeeCents, creatorAmountCents };
}
```

### 3.4 Payout Flow (Stripe Connect)

1. **Onboarding:** Creator links Stripe Connect account (Express or Custom).
2. **Each payment:** Stripe application_fee = platform cut; remainder to connected account.
3. **Payouts:** Handled by Stripe; creator configures payout schedule in Stripe Dashboard.
4. **Alternative (manual):** Platform holds funds; periodic payouts via Stripe Transfer API — more control, more compliance burden.

---

## 4. Tiered Subscriptions & Content Gating

### 4.1 Model Relationships

```
Community (1) ──→ (N) SubscriptionTier
                      e.g. Free ($0), Basic ($5/mo), Premium ($15/mo)
                      
Reader (User) ──→ (N) Subscription (one per Community, one active tier)
                      tierId → SubscriptionTier
```

### 4.2 Content Gating Logic

```typescript
// Post or Space can require a minimum tier
// Add to Post model: requiredTierId String? (null = free for all)
// Add to Space model: requiredTierId String?

function canAccess(userId: string, resource: Post | Space, communityId: string): boolean {
  const requiredTierId = resource.requiredTierId;
  if (!requiredTierId) return true;
  
  const sub = await getActiveSubscription(userId, communityId);
  if (!sub) return false;
  
  const requiredTier = await getTier(requiredTierId);
  const userTier = await getTier(sub.tierId);
  
  return userTier.price >= requiredTier.price;
}
```

### 4.3 Tier Ordering

For “minimum tier” checks, order tiers by price. Optionally add `SubscriptionTier.sortOrder` for explicit ordering (e.g. Free=0, Basic=1, Premium=2, VIP=3).

---

## 5. API Endpoints (Recommended)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/subscriptions/checkout` | Create Stripe Checkout Session; return `url` |
| POST | `/api/stripe/webhook` | Handle Stripe webhooks |
| GET | `/api/subscriptions/me` | List current user's subscriptions |
| DELETE | `/api/subscriptions/[id]` | Cancel subscription (at period end) |
| GET | `/api/dashboard/community/[slug]/earnings` | Creator earnings summary |
| GET | `/api/dashboard/community/[slug]/tiers` | List/create/edit tiers |

---

## 6. Environment Variables

```env
# Revenue share (global default)
PLATFORM_REVENUE_SHARE_PERCENT=15

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Stripe Connect (for creator payouts)
STRIPE_CONNECT_CLIENT_ID=ca_...
```
