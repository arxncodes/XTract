import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { generateWordlist } from "./lib/profiler";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.wordlist.generate.path, async (req, res) => {
    try {
      const input = api.wordlist.generate.input.parse(req.body);
      
      const words = generateWordlist(input);
      const content = words.join('\n');
      
      // Log to history
      const targetName = input.firstName || input.company || "Unknown Target";
      await storage.createProfilingRequest({
        targetName,
        wordCount: words.length
      });

      res.json({
        count: words.length,
        preview: words.slice(0, 50),
        downloadContent: content
      });
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.wordlist.history.path, async (req, res) => {
    const history = await storage.getHistory();
    res.json(history);
  });

  return httpServer;
}
