import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (userId: string, nickname: string, content: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  
  addMessage: (userId, nickname, content) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: uuidv4(),
        userId,
        nickname,
        content,
        timestamp: new Date(),
      },
    ],
  })),
  
  clearMessages: () => set({ messages: [] }),
}));
