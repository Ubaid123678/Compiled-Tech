import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export type NewsletterAction = "confirm" | "unsubscribe";

export function signNewsletterAction(action: NewsletterAction, id: string) {
  const secret = process.env.NEWSLETTER_SIGNING_SECRET;
  if (!secret || secret.length < 32) throw new Error("Newsletter signing secret is not configured");
  const signature = createHmac("sha256", secret).update(`${action}:${id}`).digest("hex");
  return `${id}.${signature}`;
}

export function readNewsletterAction(action: NewsletterAction, token: string) {
  const [id, signature, extra] = token.split(".");
  if (extra !== undefined || !z.uuid().safeParse(id).success || !/^[0-9a-f]{64}$/.test(signature || "")) return null;
  const expected = signNewsletterAction(action, id).split(".")[1];
  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex")) ? id : null;
}
