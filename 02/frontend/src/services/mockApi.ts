import { v4 as uuidv4 } from 'uuid';
import type { Room, ExecutionResult } from '@/types';
import { runPython } from './pyodideService';

// Simulated delay for API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory room storage for mock
const rooms = new Map<string, Room>();

export const mockApi = {
  async createRoom(hostId: string): Promise<Room> {
    await delay(500);
    
    const roomId = uuidv4().substring(0, 8);
    const room: Room = {
      id: roomId,
      hostId,
      users: [],
      code: '',
      language: 'javascript',
      createdAt: new Date(),
    };
    
    rooms.set(roomId, room);
    return room;
  },

  async getRoom(roomId: string): Promise<Room | null> {
    await delay(300);
    return rooms.get(roomId) || null;
  },

  async executeCode(code: string, language: string): Promise<ExecutionResult> {
    await delay(1000);
    
    if (language === 'python') {
      const startTime = performance.now();
      try {
        const result = await runPython(code);
        const executionTime = performance.now() - startTime;
        return {
          ...result,
          executionTime: Math.round(executionTime * 100) / 100,
        };
      } catch (error) {
        return {
          output: '',
          error: 'Failed to load Python runtime',
        };
      }
    }
    
    if (language === 'javascript') {
      try {
        // Capture console.log outputs
        const logs: string[] = [];
        
        // Create a sandboxed execution environment
        const sandbox = {
          console: {
            log: (...args: any[]) => {
              logs.push(args.map((arg) => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
            },
            error: (...args: any[]) => {
              logs.push(`Error: ${args.join(' ')}`);
            },
            warn: (...args: any[]) => {
              logs.push(`Warning: ${args.join(' ')}`);
            },
          },
        };
        
        // Execute the code
        const startTime = performance.now();
        const fn = new Function('console', code);
        fn(sandbox.console);
        const executionTime = performance.now() - startTime;
        
        return {
          output: logs.join('\n') || 'Code executed successfully (no output)',
          executionTime: Math.round(executionTime * 100) / 100,
        };
      } catch (error) {
        return {
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }

    return {
      output: '',
      error: `Language "${language}" is not supported yet.`,
    };
  },
};
