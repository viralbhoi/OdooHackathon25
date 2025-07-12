import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionSchema, insertAnswerSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock authentication endpoint for demo
  app.get("/api/auth/user", async (req, res) => {
    // For demo purposes, return null (user not authenticated)
    res.status(401).json({ message: "Not authenticated in demo mode" });
  });

  // Questions routes
  app.get("/api/questions", async (req, res) => {
    try {
      const { limit = 20, offset = 0, search, tag } = req.query;
      let questions;
      
      if (search) {
        questions = await storage.searchQuestions(search as string);
      } else {
        questions = await storage.getQuestions(Number(limit), Number(offset));
      }
      
      if (tag) {
        questions = questions.filter(q => q.tags.includes(tag as string));
      }
      
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const question = await storage.getQuestion(Number(req.params.id));
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      // Increment view count
      await storage.updateQuestionViews(Number(req.params.id));
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const { authorId, ...data } = req.body;
      
      const question = await storage.createQuestion({
        ...questionData,
        authorId: authorId || 1, // Default to user 1 for demo
      });
      
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  // Answers routes
  app.get("/api/questions/:id/answers", async (req, res) => {
    try {
      const answers = await storage.getAnswersByQuestion(Number(req.params.id));
      res.json(answers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch answers" });
    }
  });

  app.post("/api/questions/:id/answers", async (req, res) => {
    try {
      const answerData = insertAnswerSchema.parse(req.body);
      const { authorId, ...data } = req.body;
      
      const answer = await storage.createAnswer({
        ...answerData,
        questionId: Number(req.params.id),
        authorId: authorId || 1, // Default to user 1 for demo
      });
      
      // Update question answer count
      const answers = await storage.getAnswersByQuestion(Number(req.params.id));
      await storage.updateQuestionAnswerCount(Number(req.params.id), answers.length);
      
      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ message: "Invalid answer data" });
    }
  });

  // Votes routes
  app.post("/api/votes", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      const { userId, ...data } = req.body;
      
      // Check if vote already exists
      const existingVote = await storage.getVote(
        userId || 1, // Default to user 1 for demo
        voteData.targetId,
        voteData.targetType
      );
      
      if (existingVote) {
        // Remove existing vote if same type, otherwise update
        if (existingVote.voteType === voteData.voteType) {
          await storage.deleteVote(userId || 1, voteData.targetId, voteData.targetType);
          return res.json({ message: "Vote removed" });
        } else {
          await storage.deleteVote(userId || 1, voteData.targetId, voteData.targetType);
        }
      }
      
      const vote = await storage.createVote({
        ...voteData,
        userId: userId || 1, // Default to user 1 for demo
      });
      
      res.status(201).json(vote);
    } catch (error) {
      res.status(400).json({ message: "Invalid vote data" });
    }
  });

  // Tags routes
  app.get("/api/tags", async (req, res) => {
    try {
      const { popular } = req.query;
      let tags;
      
      if (popular) {
        tags = await storage.getPopularTags(10);
      } else {
        tags = await storage.getTags();
      }
      
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Users routes  
  app.get("/api/users", async (req, res) => {
    try {
      // For demo, return mock users data
      const mockUsers = [
        { id: 1, username: "john_doe", email: "john@example.com", reputation: 1250, role: "user", createdAt: new Date() },
        { id: 2, username: "alice_smith", email: "alice@example.com", reputation: 2100, role: "user", createdAt: new Date() },
        { id: 3, username: "mike_johnson", email: "mike@example.com", reputation: 890, role: "user", createdAt: new Date() },
      ];
      res.json(mockUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}