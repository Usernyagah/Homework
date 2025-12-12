import { create } from 'zustand';
import type { User, Room } from '@/types';

interface RoomState {
  room: Room | null;
  users: User[];
  isConnecting: boolean;
  error: string | null;
  
  setRoom: (room: Room | null) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  setUserTyping: (userId: string, isTyping: boolean) => void;
  toggleUserEditPermission: (userId: string) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  users: [],
  isConnecting: false,
  error: null,
  
  setRoom: (room) => set({ room, users: room?.users || [] }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users.filter((u) => u.id !== user.id), user],
  })),
  
  removeUser: (userId) => set((state) => ({
    users: state.users.filter((u) => u.id !== userId),
  })),
  
  updateUser: (userId, updates) => set((state) => ({
    users: state.users.map((u) => 
      u.id === userId ? { ...u, ...updates } : u
    ),
  })),
  
  setUserTyping: (userId, isTyping) => set((state) => ({
    users: state.users.map((u) =>
      u.id === userId ? { ...u, isTyping } : u
    ),
  })),
  
  toggleUserEditPermission: (userId) => set((state) => ({
    users: state.users.map((u) =>
      u.id === userId ? { ...u, canEdit: !u.canEdit } : u
    ),
  })),
  
  setConnecting: (isConnecting) => set({ isConnecting }),
  
  setError: (error) => set({ error }),
  
  clearRoom: () => set({ room: null, users: [], error: null }),
}));
