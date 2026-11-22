import { z } from "zod";
import { contactFields } from "@/data/contact";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.string().trim().max(254).email("Enter a valid email address"),
  company: z.string().trim().max(200).optional(),
  service: z.enum(contactFields.service, { error: "Select a service" }),
  budget: z.enum(contactFields.budget, { error: "Select a budget range" }),
  timeline: z.enum(contactFields.timeline, { error: "Select a timeline" }),
  details: z.string().trim().min(20, "Tell us a little more (at least 20 characters)").max(5000),
  website: z.string().trim().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
