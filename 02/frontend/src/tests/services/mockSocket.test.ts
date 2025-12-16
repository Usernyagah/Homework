import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSocket } from '@/services/mockSocket';
import { useChatStore } from '@/stores/chatStore';

describe('mockSocket chat functionality', () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [] });
    mockSocket.disconnect();
  });

  it('should emit chat_message event when sending a message', (done) => {
    const testMessage = {
      userId: 'user-1',
      nickname: 'TestUser',
      content: 'Hello world!',
    };

    mockSocket.on('chat_message', (message) => {
      expect(message.userId).toBe(testMessage.userId);
      expect(message.nickname).toBe(testMessage.nickname);
      expect(message.content).toBe(testMessage.content);
      expect(message.roomId).toBe('test-room');
      mockSocket.off('chat_message');
      done();
    });

    mockSocket.sendChatMessage('test-room', testMessage);
  });

  it('should allow multiple listeners for chat_message', (done) => {
    const testMessage = {
      userId: 'user-1',
      nickname: 'TestUser',
      content: 'Test message',
    };

    let callCount = 0;
    const handler1 = () => {
      callCount++;
      if (callCount === 2) {
        mockSocket.off('chat_message', handler1);
        mockSocket.off('chat_message', handler2);
        expect(callCount).toBe(2);
        done();
      }
    };
    const handler2 = () => {
      callCount++;
      if (callCount === 2) {
        mockSocket.off('chat_message', handler1);
        mockSocket.off('chat_message', handler2);
        expect(callCount).toBe(2);
        done();
      }
    };

    mockSocket.on('chat_message', handler1);
    mockSocket.on('chat_message', handler2);

    mockSocket.sendChatMessage('test-room', testMessage);
  });

  it('should work with chatStore integration', async () => {
    // Clear store before test
    useChatStore.setState({ messages: [] });

    const testMessage = {
      userId: 'user-1',
      nickname: 'TestUser',
      content: 'Integration test',
    };

    // Set up listener that adds to store (like Room.tsx does)
    const handleChatMessage = (message: { userId: string; nickname: string; content: string }) => {
      const { addMessage } = useChatStore.getState();
      addMessage(message.userId, message.nickname, message.content);
    };

    mockSocket.on('chat_message', handleChatMessage);
    mockSocket.sendChatMessage('test-room', testMessage);

    // Wait for the setTimeout in sendChatMessage
    await new Promise(resolve => setTimeout(resolve, 100));

    const { messages } = useChatStore.getState();
    expect(messages.length).toBeGreaterThanOrEqual(1);
    const lastMessage = messages[messages.length - 1];
    expect(lastMessage.userId).toBe(testMessage.userId);
    expect(lastMessage.nickname).toBe(testMessage.nickname);
    expect(lastMessage.content).toBe(testMessage.content);

    mockSocket.off('chat_message', handleChatMessage);
  });
});

