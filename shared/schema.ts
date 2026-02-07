import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const profilingRequests = pgTable("profiling_requests", {
  id: serial("id").primaryKey(),
  targetName: text("target_name").notNull(),
  wordCount: integer("word_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertProfilingRequestSchema = createInsertSchema(profilingRequests).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type ProfilingRequest = typeof profilingRequests.$inferSelect;
export type InsertProfilingRequest = z.infer<typeof insertProfilingRequestSchema>;

// Generation Request Schema
export const generateWordlistSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  petName: z.string().optional(),
  partnerName: z.string().optional(),
  partnerDob: z.string().optional(),
  fatherName: z.string().optional(),
  fatherDob: z.string().optional(),
  motherName: z.string().optional(),
  motherDob: z.string().optional(),
  siblingNames: z.string().optional(), // Comma separated
  siblingDobs: z.string().optional(), // Comma separated
  company: z.string().optional(),
  favHobby: z.string().optional(),
  favPerson: z.string().optional(),
  favInfluencer: z.string().optional(),
  keywords: z.string().optional(), // Comma separated
  useLeet: z.boolean().default(false),
  minLen: z.coerce.number().min(0).default(6),
  maxLen: z.coerce.number().min(0).default(20),
});

export type GenerateWordlistRequest = z.infer<typeof generateWordlistSchema>;

export interface WordlistResponse {
  count: number;
  preview: string[];
  fullList: string[]; // In a real app with huge lists, we might return a URL instead. For now, sending array is fine for moderate sizes.
}
