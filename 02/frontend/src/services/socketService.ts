import { io, Socket } from 'socket.io-client';
import { useRoomStore } from '@/stores/roomStore';
import { useEditorStore } from '@/stores/editorStore';
import { useChatStore } from '@/stores/chatStore';
import type { User, ChatMessage } from '@/types';

type EventCallback = (...args: any[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();
  private connected: boolean = false;
  private currentRoomId: string | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Don't connect immediately - wait for explicit connect() call
    // This prevents connection errors when backend isn't running
  }

  private initializeSocket() {
    if (this.socket) return; // Already initialized

    // Get backend URL from environment or use default
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
      autoConnect: false, // Don't auto-connect - wait for explicit connect() call
      forceNew: false, // Reuse existing connection if available
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('[SocketService] Connected to backend');
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      this.connected = false;
      console.log('[SocketService] Disconnected:', reason);
      this.emit('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[SocketService] Connection error:', error.message);
      if (error.description) {
        console.warn('[SocketService] Error description:', error.description);
      }
      // Check if socket will auto-reconnect
      if (this.socket && !this.socket.active) {
        // Connection was denied by server - won't auto-reconnect
        console.error('[SocketService] Connection denied - manual reconnect required');
        this.connected = false;
      }
      // If socket.active is true, it will automatically try to reconnect
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`[SocketService] Reconnection attempt ${attemptNumber}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[SocketService] Reconnection failed - backend may be unavailable');
      this.connected = false;
    });

    // Handle sync_state from server
    this.socket.on('sync_state', (data: { code: string; language: string; users: any[] }) => {
      if (data.code !== undefined) {
        useEditorStore.getState().setCode(data.code);
      }
      if (data.language) {
        useEditorStore.getState().setLanguage(data.language);
      }
      // Update users in room store
      if (data.users && Array.isArray(data.users)) {
        // Clear existing users first to avoid duplicates
        const roomStore = useRoomStore.getState();
        data.users.forEach((user) => {
          roomStore.addUser({
            id: user.userId || user.id,
            nickname: user.username || user.nickname || 'Anonymous',
            canEdit: true,
            isTyping: false,
            joinedAt: new Date(user.joinedAt || Date.now()),
          });
        });
      }
    });

    // Handle code changes from other users
    this.socket.on('code_change', (data: { code: string }) => {
      useEditorStore.getState().setCode(data.code);
    });

    // Handle language changes from other users
    this.socket.on('language_change', (data: { language: string }) => {
      useEditorStore.getState().setLanguage(data.language);
    });

    // Handle user joined
    this.socket.on('user_joined', (data: { userId: string; username?: string }) => {
      useRoomStore.getState().addUser({
        id: data.userId,
        nickname: data.username || 'Anonymous',
        canEdit: true,
        isTyping: false,
        joinedAt: new Date(),
      });
    });

    // Handle user left
    this.socket.on('user_left', (data: { userId: string }) => {
      useRoomStore.getState().removeUser(data.userId);
    });

    // Handle chat messages
    this.socket.on('chat_message', (message: { userId: string; nickname: string; content: string }) => {
      const { addMessage } = useChatStore.getState();
      addMessage(message.userId, message.nickname, message.content);
    });

    // Handle typing indicators
    this.socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      useRoomStore.getState().setUserTyping(data.userId, data.isTyping);
    });
  }

  connect() {
    // Initialize socket if not already done
    this.initializeSocket();
    
    // Connect if not already connected
    if (!this.connected && this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
      this.listeners.clear();
    }
  }

  on(event: string, callback: EventCallback) {
    // Store callback for local events
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, [...existing, callback]);

    // Also listen on socket for server events
    if (this.socket && ['connect', 'disconnect', 'sync_state', 'code_change', 'language_change', 'user_joined', 'user_left', 'chat_message', 'user_typing'].includes(event)) {
      // These are handled by setupSocketListeners, but we can add additional listeners
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: EventCallback) {
    // Remove from local listeners
    if (callback) {
      const existing = this.listeners.get(event) || [];
      this.listeners.set(event, existing.filter((cb) => cb !== callback));
    } else {
      this.listeners.delete(event);
    }

    // Remove from socket listeners
    if (this.socket && callback) {
      this.socket.off(event, callback);
    } else if (this.socket) {
      this.socket.off(event);
    }
  }

  emit(event: string, ...args: any[]) {
    // Emit to socket if connected
    if (this.socket && this.connected) {
      this.socket.emit(event, ...args);
    }

    // Also emit locally for mock compatibility
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(...args));
  }

  // Room events
  joinRoom(roomId: string, user: User) {
    if (!this.socket || !this.connected) {
      this.connect();
    }

    this.currentRoomId = roomId;

    if (this.socket) {
      this.socket.emit('join_room', {
        roomId,
        userId: user.id,
        username: user.nickname,
      });
    }
  }

  leaveRoom(userId: string) {
    if (this.socket && this.currentRoomId) {
      this.socket.emit('leave_room');
      this.currentRoomId = null;
    }
  }

  // Code sync events
  sendCodeChange(code: string, userId: string) {
    if (this.socket && this.currentRoomId) {
      this.socket.emit('code_change', {
        roomId: this.currentRoomId,
        code,
      });
    }
  }

  // Language change events
  sendLanguageChange(language: string) {
    if (this.socket && this.currentRoomId) {
      this.socket.emit('language_change', {
        roomId: this.currentRoomId,
        language,
      });
    }
  }

  // Typing indicator
  sendTypingStart(userId: string) {
    if (this.socket && this.currentRoomId) {
      useRoomStore.getState().setUserTyping(userId, true);
      this.socket.emit('user_typing', {
        roomId: this.currentRoomId,
        userId,
        isTyping: true,
      });

      // Auto-clear typing after 2 seconds
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      this.typingTimeout = setTimeout(() => {
        this.sendTypingStop(userId);
      }, 2000);
    }
  }

  sendTypingStop(userId: string) {
    if (this.socket && this.currentRoomId) {
      useRoomStore.getState().setUserTyping(userId, false);
      this.socket.emit('user_typing', {
        roomId: this.currentRoomId,
        userId,
        isTyping: false,
      });
    }
  }

  // Chat events
  sendChatMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    if (this.socket && this.connected) {
      this.socket.emit('chat_message', {
        roomId,
        userId: message.userId,
        nickname: message.nickname,
        content: message.content,
      });
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected === true;
  }
}

export const socketService = new SocketService();

