import { useRoomStore } from '@/stores/roomStore';
import { useEditorStore } from '@/stores/editorStore';
import { useChatStore } from '@/stores/chatStore';
import type { User, ChatMessage } from '@/types';

type EventCallback = (...args: any[]) => void;

class MockSocketService {
  private listeners: Map<string, EventCallback[]> = new Map();
  private connected: boolean = false;
  private typingTimeout: NodeJS.Timeout | null = null;

  connect() {
    this.connected = true;
    setTimeout(() => this.emit('connect'), 100);
  }

  disconnect() {
    this.connected = false;
    this.listeners.clear();
    this.emit('disconnect');
  }

  on(event: string, callback: EventCallback) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, [...existing, callback]);
  }

  off(event: string, callback?: EventCallback) {
    if (callback) {
      const existing = this.listeners.get(event) || [];
      this.listeners.set(event, existing.filter((cb) => cb !== callback));
    } else {
      this.listeners.delete(event);
    }
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(...args));
  }

  // Simulate receiving events from server
  simulateServerEvent(event: string, data: any) {
    this.emit(event, data);
  }

  // Room events
  joinRoom(roomId: string, user: User) {
    setTimeout(() => {
      useRoomStore.getState().addUser(user);
      this.emit('user_joined', user);
    }, 200);
  }

  leaveRoom(userId: string) {
    setTimeout(() => {
      useRoomStore.getState().removeUser(userId);
      this.emit('user_left', { userId });
    }, 100);
  }

  // Code sync events
  sendCodeChange(code: string, userId: string) {
    // Simulate broadcasting to other users
    useEditorStore.getState().setCode(code);
    this.emit('code_updated', { code, userId });
  }

  // Typing indicator
  sendTypingStart(userId: string) {
    useRoomStore.getState().setUserTyping(userId, true);
    this.emit('user_typing', { userId, isTyping: true });
    
    // Auto-clear typing after 2 seconds
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      this.sendTypingStop(userId);
    }, 2000);
  }

  sendTypingStop(userId: string) {
    useRoomStore.getState().setUserTyping(userId, false);
    this.emit('user_typing', { userId, isTyping: false });
  }

  // Chat events
  sendChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    // In mock mode, simulate server broadcasting to all users (including sender)
    // The Room.tsx listener will handle adding it to the store
    setTimeout(() => {
      this.emit('chat_message', message);
    }, 50);
  }

  isConnected() {
    return this.connected;
  }
}

export const mockSocket = new MockSocketService();
