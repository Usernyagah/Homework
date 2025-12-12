import { useEditorStore } from '@/stores/editorStore';
import { Terminal, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OutputConsole() {
  const { executionResult, isExecuting } = useEditorStore();

  return (
    <div className="h-full flex flex-col bg-card/30 border-t">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Output Console</span>
        
        {executionResult?.executionTime !== undefined && (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {executionResult.executionTime}ms
          </span>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        {isExecuting ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            Running code...
          </div>
        ) : executionResult ? (
          <div className="space-y-2">
            {executionResult.error ? (
              <div className="flex items-start gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <pre className="whitespace-pre-wrap break-words">
                  {executionResult.error}
                </pre>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                <pre className={cn(
                  "whitespace-pre-wrap break-words text-foreground"
                )}>
                  {executionResult.output}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Click "Run Code" to execute your code and see the output here.
          </p>
        )}
      </div>
    </div>
  );
}
