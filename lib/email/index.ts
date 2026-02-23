/**
 * Email infrastructure - public API
 */

export { enqueueEmail, enqueueEmailBatch, enqueueNewPostNotification, enqueueWelcome } from "./queue";
export type { EnqueueOptions } from "./queue";
export type { EmailMessage, EmailType } from "./types";
export { processEmailQueue } from "./worker";
