import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  reputation: integer("reputation").default(0).notNull(),
  role: text("role", { enum: ["guest", "user", "admin"] }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  votes: integer("votes").notNull().default(0),
  views: integer("views").notNull().default(0),
  answerCount: integer("answer_count").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  accepted: boolean("accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  votes: integer("votes").notNull().default(0),
  accepted: boolean("accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  targetId: integer("target_id").notNull(),
  targetType: text("target_type", { enum: ["question", "answer"] }).notNull(),
  voteType: text("vote_type", { enum: ["up", "down"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  useCount: integer("use_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  title: true,
  content: true,
  tags: true,
});

export const insertAnswerSchema = createInsertSchema(answers).pick({
  content: true,
  questionId: true,
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  targetId: true,
  targetType: true,
  voteType: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Tag = typeof tags.$inferSelect;
