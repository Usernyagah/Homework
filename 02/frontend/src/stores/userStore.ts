import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '@/types';

interface UserState {
  currentUser: User | null;
  setNickname: (nickname: string) => void;
  setAsHost: (isHost: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      
      setNickname: (nickname: string) => {
        const existing = get().currentUser;
        set({
          currentUser: {
            id: existing?.id || uuidv4(),
            nickname,
            isHost: existing?.isHost || false,
            isTyping: false,
            canEdit: true,
            joinedAt: existing?.joinedAt || new Date(),
          },
        });
      },
      
      setAsHost: (isHost: boolean) => {
        const current = get().currentUser;
        if (current) {
          set({ currentUser: { ...current, isHost } });
        }
      },
      
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
