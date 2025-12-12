import { create } from 'zustand';
import type { EditorTheme, ExecutionResult } from '@/types';

interface EditorState {
  code: string;
  language: string;
  theme: EditorTheme;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: EditorTheme) => void;
  toggleTheme: () => void;
  setExecuting: (executing: boolean) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;
  clearExecution: () => void;
}

const DEFAULT_CODES: Record<string, string> = {
  javascript: `// Welcome to the Coding Interview Platform!
// Write your JavaScript code here and click "Run Code" to execute.

function greet(name) {
  return \`Hello, \${name}! Welcome to the interview.\`;
}

console.log(greet("Candidate"));
`,
  python: `# Welcome to the Coding Interview Platform!
# Write your Python code here and click "Run Code" to execute.

def greet(name):
    return f"Hello, {name}! Welcome to the interview."

print(greet("Candidate"))
`,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  code: DEFAULT_CODES.javascript,
  language: 'javascript',
  theme: 'vs-dark',
  isExecuting: false,
  executionResult: null,
  
  setCode: (code) => set({ code }),
  
  setLanguage: (language) => {
    const currentCode = get().code;
    const currentLang = get().language;
    const nextDefault = DEFAULT_CODES[language];
    const currentDefault = DEFAULT_CODES[currentLang];

    // If user hasn't modified away from the default of the previous language, swap to the new default.
    const shouldSwapToDefault =
      (currentCode === currentDefault) || currentCode.trim() === '';

    set({
      language,
      code: shouldSwapToDefault && nextDefault ? nextDefault : currentCode,
    });
  },
  
  setTheme: (theme) => set({ theme }),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'vs-dark' ? 'light' : 'vs-dark',
  })),
  
  setExecuting: (isExecuting) => set({ isExecuting }),
  
  setExecutionResult: (executionResult) => set({ executionResult }),
  
  clearExecution: () => set({ executionResult: null }),
}));
