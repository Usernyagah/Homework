export interface User {
  id: string;
  nickname: string;
  isHost: boolean;
  isTyping: boolean;
  canEdit: boolean;
  joinedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  nickname: string;
  content: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  hostId: string;
  users: User[];
  code: string;
  language: string;
  createdAt: Date;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime?: number;
}

export type EditorTheme = 'vs-dark' | 'light';
