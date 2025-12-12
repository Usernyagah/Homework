import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({
      code: '',
      language: 'javascript',
      theme: 'vs-dark',
      isExecuting: false,
      executionResult: null,
    });
  });

  it('should set code', () => {
    const { setCode } = useEditorStore.getState();
    setCode('console.log("Hello");');
    
    const { code } = useEditorStore.getState();
    expect(code).toBe('console.log("Hello");');
  });

  it('should toggle theme', () => {
    const { toggleTheme } = useEditorStore.getState();
    expect(useEditorStore.getState().theme).toBe('vs-dark');
    
    toggleTheme();
    expect(useEditorStore.getState().theme).toBe('light');
    
    toggleTheme();
    expect(useEditorStore.getState().theme).toBe('vs-dark');
  });

  it('should set execution result', () => {
    const { setExecutionResult } = useEditorStore.getState();
    setExecutionResult({ output: 'Hello World', executionTime: 5 });
    
    const { executionResult } = useEditorStore.getState();
    expect(executionResult?.output).toBe('Hello World');
    expect(executionResult?.executionTime).toBe(5);
  });

  it('should clear execution result', () => {
    const { setExecutionResult, clearExecution } = useEditorStore.getState();
    setExecutionResult({ output: 'test' });
    clearExecution();
    
    const { executionResult } = useEditorStore.getState();
    expect(executionResult).toBeNull();
  });
});
