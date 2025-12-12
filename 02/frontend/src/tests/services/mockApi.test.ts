import { describe, it, expect } from 'vitest';
import { mockApi } from '@/services/mockApi';

describe('mockApi', () => {
  describe('createRoom', () => {
    it('should create a room with valid ID', async () => {
      const room = await mockApi.createRoom('host-123');
      
      expect(room.id).toBeDefined();
      expect(room.id.length).toBe(8);
      expect(room.hostId).toBe('host-123');
      expect(room.users).toEqual([]);
      expect(room.language).toBe('javascript');
    });
  });

  describe('executeCode', () => {
    it('should execute valid JavaScript code', async () => {
      const result = await mockApi.executeCode('console.log("Hello");', 'javascript');
      
      expect(result.error).toBeUndefined();
      expect(result.output).toBe('Hello');
    });

    it('should return error for invalid code', async () => {
      const result = await mockApi.executeCode('throw new Error("Test error");', 'javascript');
      
      expect(result.error).toBe('Test error');
    });

    it('should reject unsupported languages', async () => {
      const result = await mockApi.executeCode('print("Hello")', 'python');
      
      expect(result.error).toContain('not supported');
    });

    it('should capture multiple console.log outputs', async () => {
      const code = `
        console.log("Line 1");
        console.log("Line 2");
        console.log("Line 3");
      `;
      const result = await mockApi.executeCode(code, 'javascript');
      
      expect(result.output).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should handle objects in console.log', async () => {
      const code = 'console.log({ name: "test" });';
      const result = await mockApi.executeCode(code, 'javascript');
      
      expect(result.output).toContain('"name"');
      expect(result.output).toContain('"test"');
    });
  });
});
