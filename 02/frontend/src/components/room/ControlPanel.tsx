import { useEditorStore } from '@/stores/editorStore';
import { useUserStore } from '@/stores/userStore';
import { useRoomStore } from '@/stores/roomStore';
import { mockApi } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
];

export function ControlPanel() {
  const { code, language, setLanguage, isExecuting, setExecuting, setExecutionResult } = useEditorStore();
  const { currentUser } = useUserStore();
  const { users } = useRoomStore();
  
  const user = users.find((u) => u.id === currentUser?.id);
  const canEdit = user?.canEdit ?? true;

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('No code to execute');
      return;
    }
    
    setExecuting(true);
    setExecutionResult(null);
    
    try {
      const result = await mockApi.executeCode(code, language);
      setExecutionResult(result);
      
      if (result.error) {
        toast.error('Execution failed');
      } else {
        toast.success('Code executed successfully');
      }
    } catch (error) {
      setExecutionResult({
        output: '',
        error: 'Failed to execute code',
      });
      toast.error('Failed to execute code');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border-t">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Language</label>
        <Select value={language} onValueChange={setLanguage} disabled={!canEdit}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={runCode}
        disabled={isExecuting || !canEdit}
        className="w-full gap-2"
        size="lg"
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Code
          </>
        )}
      </Button>
    </div>
  );
}
