import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  company: z.string().optional(),
  service: z.string().min(1, "Select a service"),
  budget: z.string().min(1, "Select a budget range"),
  timeline: z.string().min(1, "Select a timeline"),
  details: z.string().min(20, "Tell us a little more (at least 20 characters)"),
  website: z.string().optional(), // honeypot
  "cf-turnstile-response": z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;