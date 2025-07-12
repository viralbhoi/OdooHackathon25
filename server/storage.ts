import {
  users,
  questions,
  answers,
  votes,
  tags,
  type User,
  type Question,
  type Answer,
  type Vote,
  type Tag,
  type InsertUser,
  type InsertQuestion,
  type InsertAnswer,
  type InsertVote
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserReputation(id: number, reputation: number): Promise<User>;

  // Question operations
  getQuestions(limit?: number, offset?: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByUser(userId: number): Promise<Question[]>;
  searchQuestions(query: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion & { authorId: number }): Promise<Question>;
  updateQuestionVotes(id: number, votes: number): Promise<Question>;
  updateQuestionViews(id: number): Promise<Question>;
  updateQuestionAnswerCount(id: number, count: number): Promise<Question>;

  // Answer operations
  getAnswersByQuestion(questionId: number): Promise<Answer[]>;
  getAnswer(id: number): Promise<Answer | undefined>;
  createAnswer(answer: InsertAnswer & { authorId: number }): Promise<Answer>;
  updateAnswerVotes(id: number, votes: number): Promise<Answer>;
  acceptAnswer(id: number): Promise<Answer>;

  // Vote operations
  getVote(userId: number, targetId: number, targetType: "question" | "answer"): Promise<Vote | undefined>;
  createVote(vote: InsertVote & { userId: number }): Promise<Vote>;
  deleteVote(userId: number, targetId: number, targetType: "question" | "answer"): Promise<void>;

  // Tag operations
  getTags(): Promise<Tag[]>;
  getPopularTags(limit?: number): Promise<Tag[]>;
  createTag(name: string, description?: string): Promise<Tag>;
  updateTagUseCount(name: string, count: number): Promise<Tag>;

  // Statistics
  getStats(): Promise<{
    totalQuestions: number;
    totalAnswers: number;
    activeUsers: number;
    questionsToday: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private answers: Map<number, Answer>;
  private votes: Map<string, Vote>;
  private tags: Map<string, Tag>;
  private currentId: {
    users: number;
    questions: number;
    answers: number;
    votes: number;
    tags: number;
  };

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.answers = new Map();
    this.votes = new Map();
    this.tags = new Map();
    this.currentId = {
      users: 1,
      questions: 1,
      answers: 1,
      votes: 1,
      tags: 1,
    };

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample users
    const sampleUsers = [
      { username: "john_doe", email: "john@example.com", password: "hashed_password", role: "user" as const, reputation: 1234 },
      { username: "alice_smith", email: "alice@example.com", password: "hashed_password", role: "user" as const, reputation: 567 },
      { username: "mike_johnson", email: "mike@example.com", password: "hashed_password", role: "user" as const, reputation: 2891 },
      { username: "admin", email: "admin@example.com", password: "hashed_password", role: "admin" as const, reputation: 5000 },
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        ...userData,
        id: this.currentId.users++,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });

    // Create sample tags
    const sampleTags = [
      { name: "javascript", description: "JavaScript programming language", useCount: 150 },
      { name: "react", description: "React.js library", useCount: 120 },
      { name: "python", description: "Python programming language", useCount: 98 },
      { name: "css", description: "Cascading Style Sheets", useCount: 87 },
      { name: "html", description: "HyperText Markup Language", useCount: 76 },
    ];

    sampleTags.forEach(tagData => {
      const tag: Tag = {
        ...tagData,
        id: this.currentId.tags++,
        createdAt: new Date(),
      };
      this.tags.set(tag.name, tag);
    });

    // Create sample questions
    const sampleQuestions = [
      {
        title: "How to implement user authentication in React with JWT tokens?",
        content: "I'm trying to implement JWT-based authentication in my React application, but I'm struggling with storing the tokens securely and handling token refresh...",
        authorId: 1,
        votes: 15,
        views: 127,
        answerCount: 3,
        tags: ["react", "jwt", "authentication"],
      },
      {
        title: "Best practices for CSS Grid vs Flexbox layout?",
        content: "When should I use CSS Grid over Flexbox? I understand the basics but need guidance on real-world scenarios and performance considerations...",
        authorId: 2,
        votes: 7,
        views: 89,
        answerCount: 1,
        tags: ["css", "layout", "flexbox", "grid"],
        accepted: true,
      },
      {
        title: "How to optimize database queries for large datasets?",
        content: "My application is struggling with performance when dealing with tables containing millions of rows. What are the best indexing strategies and query optimization techniques...",
        authorId: 3,
        votes: 23,
        views: 412,
        answerCount: 5,
        tags: ["database", "performance", "sql"],
      },
    ];

    sampleQuestions.forEach(questionData => {
      const question: Question = {
        ...questionData,
        id: this.currentId.questions++,
        accepted: questionData.accepted || false,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
        updatedAt: new Date(),
      };
      this.questions.set(question.id, question);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = {
      ...insertUser,
      id,
      role: "user",
      reputation: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserReputation(id: number, reputation: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, reputation };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getQuestions(limit = 20, offset = 0): Promise<Question[]> {
    const allQuestions = Array.from(this.questions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allQuestions.slice(offset, offset + limit);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByUser(userId: number): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.authorId === userId);
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.questions.values()).filter(q =>
      q.title.toLowerCase().includes(lowercaseQuery) ||
      q.content.toLowerCase().includes(lowercaseQuery) ||
      q.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createQuestion(questionData: InsertQuestion & { authorId: number }): Promise<Question> {
    const id = this.currentId.questions++;
    const question: Question = {
      ...questionData,
      id,
      votes: 0,
      views: 0,
      answerCount: 0,
      tags: questionData.tags || [],
      accepted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestionVotes(id: number, votes: number): Promise<Question> {
    const question = this.questions.get(id);
    if (!question) throw new Error("Question not found");
    const updatedQuestion = { ...question, votes };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async updateQuestionViews(id: number): Promise<Question> {
    const question = this.questions.get(id);
    if (!question) throw new Error("Question not found");
    const updatedQuestion = { ...question, views: question.views + 1 };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async updateQuestionAnswerCount(id: number, count: number): Promise<Question> {
    const question = this.questions.get(id);
    if (!question) throw new Error("Question not found");
    const updatedQuestion = { ...question, answerCount: count };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async getAnswersByQuestion(questionId: number): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter(a => a.questionId === questionId);
  }

  async getAnswer(id: number): Promise<Answer | undefined> {
    return this.answers.get(id);
  }

  async createAnswer(answerData: InsertAnswer & { authorId: number }): Promise<Answer> {
    const id = this.currentId.answers++;
    const answer: Answer = {
      ...answerData,
      id,
      votes: 0,
      accepted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.answers.set(id, answer);
    return answer;
  }

  async updateAnswerVotes(id: number, votes: number): Promise<Answer> {
    const answer = this.answers.get(id);
    if (!answer) throw new Error("Answer not found");
    const updatedAnswer = { ...answer, votes };
    this.answers.set(id, updatedAnswer);
    return updatedAnswer;
  }

  async acceptAnswer(id: number): Promise<Answer> {
    const answer = this.answers.get(id);
    if (!answer) throw new Error("Answer not found");
    const updatedAnswer = { ...answer, accepted: true };
    this.answers.set(id, updatedAnswer);
    return updatedAnswer;
  }

  async getVote(userId: number, targetId: number, targetType: "question" | "answer"): Promise<Vote | undefined> {
    const key = `${userId}-${targetId}-${targetType}`;
    return this.votes.get(key);
  }

  async createVote(voteData: InsertVote & { userId: number }): Promise<Vote> {
    const id = this.currentId.votes++;
    const vote: Vote = {
      ...voteData,
      id,
      createdAt: new Date(),
    };
    const key = `${vote.userId}-${vote.targetId}-${vote.targetType}`;
    this.votes.set(key, vote);
    return vote;
  }

  async deleteVote(userId: number, targetId: number, targetType: "question" | "answer"): Promise<void> {
    const key = `${userId}-${targetId}-${targetType}`;
    this.votes.delete(key);
  }

  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async getPopularTags(limit = 10): Promise<Tag[]> {
    return Array.from(this.tags.values())
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  }

  async createTag(name: string, description?: string): Promise<Tag> {
    const id = this.currentId.tags++;
    const tag: Tag = {
      id,
      name,
      description: description || null,
      useCount: 0,
      createdAt: new Date(),
    };
    this.tags.set(name, tag);
    return tag;
  }

  async updateTagUseCount(name: string, count: number): Promise<Tag> {
    const tag = this.tags.get(name);
    if (!tag) throw new Error("Tag not found");
    const updatedTag = { ...tag, useCount: count };
    this.tags.set(name, updatedTag);
    return updatedTag;
  }

  async getStats(): Promise<{
    totalQuestions: number;
    totalAnswers: number;
    activeUsers: number;
    questionsToday: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const questionsToday = Array.from(this.questions.values())
      .filter(q => q.createdAt >= today).length;

    return {
      totalQuestions: this.questions.size,
      totalAnswers: this.answers.size,
      activeUsers: this.users.size,
      questionsToday,
    };
  }
}

export const storage = new MemStorage();
