import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  inquiryType: z.string().min(1, "Choose an inquiry type"),
  budgetRange: z.string().optional(),
  timeline: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)"),
  consent: z.boolean().refine((v) => v === true, "Consent is required"),
  // Honeypot field — real visitors never fill this in.
  company_website: z.string().max(0, "Spam check failed").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const bookingFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  eventType: z.string().min(1, "Choose an event type"),
  date: z.string().min(1, "Preferred date is required"),
  backupDate: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  guests: z.coerce.number().int().positive("Guest count must be at least 1"),
  addOns: z.array(z.string()).default([]),
  budget: z.string().optional(),
  notes: z.string().trim().optional(),
  agreeHouseRules: z.boolean().refine((v) => v === true, "You must agree to the house rules"),
  company_website: z.string().max(0, "Spam check failed").optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
