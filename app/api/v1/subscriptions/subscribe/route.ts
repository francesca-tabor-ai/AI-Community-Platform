import { NextRequest } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest, notFound, apiError } from "@/lib/api-v1/errors";

const subscribeSchema = z.object({
  creatorId: z.string().min(1),
  stripeToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_DEFAULT_PRICE_ID;

  if (!stripeKey) {
    return apiError(503, "Payments not configured", { code: "STRIPE_NOT_CONFIGURED" });
  }
  if (!priceId) {
    return apiError(503, "Subscription price not configured", { code: "STRIPE_PRICE_NOT_CONFIGURED" });
  }

  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const { creatorId, stripeToken } = parsed.data;
    const subscriberEmail = authResult.user.email;

    if (!subscriberEmail) {
      return badRequest("User email is required for subscriptions", { email: "Email not set" });
    }

    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });
    if (!creator) return notFound("Creator not found");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });

    // stripeToken is either a PaymentMethod ID (pm_xxx) or a token (tok_xxx)
    const isPaymentMethod = stripeToken.startsWith("pm_");

    let customerId: string;

    if (isPaymentMethod) {
      const pm = await stripe.paymentMethods.retrieve(stripeToken);
      if (pm.customer) {
        customerId = typeof pm.customer === "string" ? pm.customer : pm.customer.id;
      } else {
        const customers = await stripe.customers.list({ email: subscriberEmail, limit: 1 });
        let customer: Stripe.Customer;
        if (customers.data.length > 0) {
          customer = customers.data[0];
        } else {
          customer = await stripe.customers.create({
            email: subscriberEmail,
            payment_method: stripeToken,
            invoice_settings: { default_payment_method: stripeToken },
          });
        }
        customerId = customer.id;
        await stripe.paymentMethods.attach(stripeToken, { customer: customerId });
        await stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: stripeToken },
        });
      }
    } else {
      const customers = await stripe.customers.list({ email: subscriberEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: subscriberEmail,
          source: stripeToken,
        });
        customerId = customer.id;
      }
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const status = subscription.status === "active" ? "active" : subscription.status;

    const sub = await prisma.creatorStripeSubscription.create({
      data: {
        creatorId,
        subscriberEmail,
        stripeSubscriptionId: subscription.id,
        status,
      },
    });

    return Response.json(
      {
        subscription: {
          id: sub.id,
          creatorId: sub.creatorId,
          subscriberEmail: sub.subscriberEmail,
          stripeSubscriptionId: sub.stripeSubscriptionId,
          status: sub.status,
          createdAt: sub.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      return apiError(400, err.message ?? "Stripe error", { code: "STRIPE_ERROR" });
    }
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
