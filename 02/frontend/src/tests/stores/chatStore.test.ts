import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '@/stores/chatStore';

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [] });
  });

  it('should add a message', () => {
    const { addMessage } = useChatStore.getState();
    addMessage('user-1', 'TestUser', 'Hello everyone!');
    
    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('Hello everyone!');
    expect(messages[0].nickname).toBe('TestUser');
  });

  it('should add multiple messages', () => {
    const { addMessage } = useChatStore.getState();
    addMessage('user-1', 'User1', 'First message');
    addMessage('user-2', 'User2', 'Second message');
    
    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(2);
  });

  it('should clear messages', () => {
    const { addMessage, clearMessages } = useChatStore.getState();
    addMessage('user-1', 'User1', 'Test message');
    clearMessages();
    
    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(0);
  });

  it('should have correct timestamp', () => {
    const { addMessage } = useChatStore.getState();
    const before = new Date();
    addMessage('user-1', 'User1', 'Test');
    const after = new Date();
    
    const { messages } = useChatStore.getState();
    const timestamp = new Date(messages[0].timestamp);
    expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
