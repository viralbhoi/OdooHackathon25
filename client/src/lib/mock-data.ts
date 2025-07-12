export interface MockUser {
  id: number;
  username: string;
  email: string;
  reputation: number;
  role: "guest" | "user" | "admin";
  avatar?: string;
  joinedAt: Date;
}

export interface MockQuestion {
  id: number;
  title: string;
  content: string;
  author: MockUser;
  votes: number;
  views: number;
  answerCount: number;
  tags: string[];
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockAnswer {
  id: number;
  content: string;
  questionId: number;
  author: MockUser;
  votes: number;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockTag {
  id: number;
  name: string;
  description?: string;
  useCount: number;
  color: string;
}

export interface MockStats {
  totalQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  questionsToday: number;
}

export interface MockActivity {
  id: number;
  user: MockUser;
  action: string;
  target: string;
  timeAgo: string;
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    reputation: 1234,
    role: "user",
    joinedAt: new Date("2023-01-15"),
  },
  {
    id: 2,
    username: "alice_smith",
    email: "alice@example.com",
    reputation: 567,
    role: "user",
    joinedAt: new Date("2023-06-10"),
  },
  {
    id: 3,
    username: "mike_johnson",
    email: "mike@example.com",
    reputation: 2891,
    role: "user",
    joinedAt: new Date("2022-11-20"),
  },
  {
    id: 4,
    username: "admin",
    email: "admin@example.com",
    reputation: 5000,
    role: "admin",
    joinedAt: new Date("2022-01-01"),
  },
  {
    id: 5,
    username: "sarah_johnson",
    email: "sarah@example.com",
    reputation: 15678,
    role: "user",
    joinedAt: new Date("2021-08-12"),
  },
  {
    id: 6,
    username: "david_miller",
    email: "david@example.com",
    reputation: 12543,
    role: "user",
    joinedAt: new Date("2022-03-18"),
  },
  {
    id: 7,
    username: "emma_lee",
    email: "emma@example.com",
    reputation: 9876,
    role: "user",
    joinedAt: new Date("2022-07-05"),
  },
];

// Mock Tags
export const mockTags: MockTag[] = [
  { id: 1, name: "javascript", description: "JavaScript programming language", useCount: 150, color: "blue" },
  { id: 2, name: "react", description: "React.js library", useCount: 120, color: "green" },
  { id: 3, name: "python", description: "Python programming language", useCount: 98, color: "purple" },
  { id: 4, name: "css", description: "Cascading Style Sheets", useCount: 87, color: "yellow" },
  { id: 5, name: "html", description: "HyperText Markup Language", useCount: 76, color: "red" },
  { id: 6, name: "nodejs", description: "Node.js runtime", useCount: 65, color: "green" },
  { id: 7, name: "typescript", description: "TypeScript language", useCount: 54, color: "blue" },
  { id: 8, name: "database", description: "Database technologies", useCount: 43, color: "purple" },
  { id: 9, name: "jwt", description: "JSON Web Tokens", useCount: 32, color: "orange" },
  { id: 10, name: "authentication", description: "User authentication", useCount: 28, color: "red" },
];

// Mock Questions
export const mockQuestions: MockQuestion[] = [
  {
    id: 1,
    title: "How to implement user authentication in React with JWT tokens?",
    content: "I'm trying to implement JWT-based authentication in my React application, but I'm struggling with storing the tokens securely and handling token refresh. What are the best practices for implementing this?\n\nI've tried storing the tokens in localStorage, but I've heard this might not be secure. Should I use httpOnly cookies instead? How do I handle token refresh automatically?\n\nHere's what I've tried so far:\n\n```javascript\n// Login function\nconst login = async (credentials) => {\n  const response = await fetch('/api/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(credentials)\n  });\n  const data = await response.json();\n  localStorage.setItem('token', data.token);\n};\n```\n\nAny guidance would be appreciated!",
    author: mockUsers[0],
    votes: 15,
    views: 127,
    answerCount: 3,
    tags: ["react", "jwt", "authentication"],
    accepted: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Best practices for CSS Grid vs Flexbox layout?",
    content: "When should I use CSS Grid over Flexbox? I understand the basics but need guidance on real-world scenarios and performance considerations.\n\nI know that:\n- Flexbox is for 1-dimensional layouts\n- Grid is for 2-dimensional layouts\n\nBut in practice, when do you choose one over the other? Are there performance differences? Can you provide some examples of when each is most appropriate?\n\nFor example, for a card layout, should I use Grid or Flexbox?",
    author: mockUsers[1],
    votes: 7,
    views: 89,
    answerCount: 1,
    tags: ["css", "layout", "flexbox", "grid"],
    accepted: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "How to optimize database queries for large datasets?",
    content: "My application is struggling with performance when dealing with tables containing millions of rows. What are the best indexing strategies and query optimization techniques?\n\nI'm working with PostgreSQL and have a table with 10+ million records. Simple SELECT queries are taking 5-10 seconds, which is unacceptable for a web application.\n\nCurrent table structure:\n```sql\nCREATE TABLE user_activities (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER,\n  activity_type VARCHAR(50),\n  timestamp TIMESTAMP,\n  metadata JSONB\n);\n```\n\nMost common queries:\n- Find activities by user_id\n- Find activities by activity_type and date range\n- Aggregate activities by type per day\n\nWhat indexing strategy should I use? Should I consider partitioning?",
    author: mockUsers[2],
    votes: 23,
    views: 412,
    answerCount: 5,
    tags: ["database", "performance", "sql"],
    accepted: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Mock Answers
export const mockAnswers: MockAnswer[] = [
  {
    id: 1,
    content: "For JWT authentication in React, here are the best practices I recommend:\n\n**Token Storage:**\n1. **Use httpOnly cookies** instead of localStorage for the refresh token\n2. **Store access token in memory** (React state) for short-term use\n3. **Never store sensitive tokens in localStorage** - it's vulnerable to XSS attacks\n\n**Implementation approach:**\n```javascript\n// Use a secure httpOnly cookie for refresh token\nconst login = async (credentials) => {\n  const response = await fetch('/api/login', {\n    method: 'POST',\n    credentials: 'include', // Important for cookies\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(credentials)\n  });\n  const data = await response.json();\n  // Store access token in state, refresh token in httpOnly cookie\n  setAccessToken(data.accessToken);\n};\n```\n\n**Token Refresh:**\nImplement automatic token refresh using an axios interceptor or similar mechanism.\n\nThis approach is much more secure and follows industry best practices.",
    questionId: 1,
    author: mockUsers[4],
    votes: 12,
    accepted: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 2,
    content: "Here's my rule of thumb for choosing between Grid and Flexbox:\n\n**Use Flexbox when:**\n- You need to align items in a single direction\n- You're working with components/UI elements\n- You need items to grow/shrink based on content\n- You're building navigation bars, toolbars, or button groups\n\n**Use Grid when:**\n- You need precise control over both rows and columns\n- You're creating page layouts\n- You have complex overlapping requirements\n- You need to align items in two dimensions\n\n**For card layouts specifically:**\nI usually start with Flexbox for simple card grids, but switch to Grid when I need:\n- Cards to align perfectly in rows and columns\n- Different sized cards in a complex layout\n- Precise spacing control\n\n**Performance:** The difference is negligible for most use cases. Choose based on the layout requirements, not performance.\n\nExample card layout with Grid:\n```css\n.card-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}\n```",
    questionId: 2,
    author: mockUsers[5],
    votes: 8,
    accepted: true,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
];

// Mock Statistics
export const mockStats: MockStats = {
  totalQuestions: 2847,
  totalAnswers: 5692,
  activeUsers: 1234,
  questionsToday: 15,
};

// Mock Recent Activity
export const mockRecentActivity: MockActivity[] = [
  {
    id: 1,
    user: mockUsers[6],
    action: "answered",
    target: "How to handle async operations...",
    timeAgo: "5 minutes ago",
  },
  {
    id: 2,
    user: mockUsers[1],
    action: "asked",
    target: "Best practices for API design",
    timeAgo: "12 minutes ago",
  },
  {
    id: 3,
    user: mockUsers[2],
    action: "accepted an answer for",
    target: "JavaScript closure concepts",
    timeAgo: "1 hour ago",
  },
  {
    id: 4,
    user: mockUsers[0],
    action: "commented on",
    target: "React hooks best practices",
    timeAgo: "2 hours ago",
  },
  {
    id: 5,
    user: mockUsers[4],
    action: "voted on",
    target: "TypeScript vs JavaScript debate",
    timeAgo: "3 hours ago",
  },
];

// Mock Top Contributors
export const mockTopContributors = [
  {
    id: 1,
    user: mockUsers[4], // Sarah Johnson
    answers: 127,
    reputation: 15678,
  },
  {
    id: 2,
    user: mockUsers[5], // David Miller
    answers: 94,
    reputation: 12543,
  },
  {
    id: 3,
    user: mockUsers[6], // Emma Lee
    answers: 76,
    reputation: 9876,
  },
];

// Utility functions
export const getInitials = (username: string): string => {
  return username
    .split("_")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 10080) {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const weeks = Math.floor(diffInMinutes / 10080);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getTagColor = (tagName: string): string => {
  const tag = mockTags.find(t => t.name === tagName);
  return tag?.color || "blue";
};

// Search functionality
export const searchQuestions = (query: string): MockQuestion[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockQuestions.filter(question =>
    question.title.toLowerCase().includes(lowercaseQuery) ||
    question.content.toLowerCase().includes(lowercaseQuery) ||
    question.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getQuestionsByTag = (tagName: string): MockQuestion[] => {
  return mockQuestions.filter(question =>
    question.tags.includes(tagName.toLowerCase())
  );
};

export const getQuestionsByUser = (userId: number): MockQuestion[] => {
  return mockQuestions.filter(question => question.author.id === userId);
};

export const getAnswersByQuestion = (questionId: number): MockAnswer[] => {
  return mockAnswers.filter(answer => answer.questionId === questionId);
};
