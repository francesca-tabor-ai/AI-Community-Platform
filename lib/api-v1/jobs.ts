/**
 * Background job triggers for API v1.
 * Uses database-backed EmailJob queue as a simple message queue.
 * For production, replace with RabbitMQ/Celery or similar.
 */
import { prisma } from "@/lib/prisma";

export async function enqueueNewPostNotifications(postId: string) {
  try {
    const post = await prisma.creatorPost.findUnique({
      where: { id: postId },
      include: { creator: true },
    });
    if (!post) return;

    const subscribers = await prisma.creatorSubscription.findMany({
      where: { creatorId: post.creatorId, status: "active" },
      include: { subscriber: true },
    });

    const jobs = subscribers
      .filter((s) => s.subscriber.email)
      .map((s) => ({
        emailType: "new_post_notification",
        recipientEmail: s.subscriber.email!,
        recipientName: s.subscriber.name ?? s.subscriber.username ?? undefined,
        templateData: {
          postId,
          postTitle: post.title,
          creatorName: post.creator.name ?? post.creator.username ?? "Creator",
        },
        metadata: { postId, subscriberId: s.subscriberId },
      }));

    if (jobs.length > 0) {
      await prisma.emailJob.createMany({
        data: jobs,
      });
    }
  } catch (err) {
    console.error("[enqueueNewPostNotifications] Error:", err);
  }
}
