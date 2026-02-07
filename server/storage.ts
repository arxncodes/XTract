import { db } from "./db";
import {
  profilingRequests,
  type InsertProfilingRequest,
  type ProfilingRequest
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createProfilingRequest(request: InsertProfilingRequest): Promise<ProfilingRequest>;
  getHistory(): Promise<ProfilingRequest[]>;
}

export class DatabaseStorage implements IStorage {
  async createProfilingRequest(request: InsertProfilingRequest): Promise<ProfilingRequest> {
    const [entry] = await db.insert(profilingRequests).values(request).returning();
    return entry;
  }

  async getHistory(): Promise<ProfilingRequest[]> {
    return await db.select().from(profilingRequests).orderBy(desc(profilingRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
