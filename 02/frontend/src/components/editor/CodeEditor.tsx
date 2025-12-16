import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/stores/editorStore';
import { useUserStore } from '@/stores/userStore';
import { useRoomStore } from '@/stores/roomStore';
import { socketService } from '@/services/socketService';
import { Loader2 } from 'lucide-react';

export function CodeEditor() {
  const { code, setCode, theme, language } = useEditorStore();
  const { currentUser } = useUserStore();
  const { users } = useRoomStore();
  
  const user = users.find((u) => u.id === currentUser?.id);
  const canEdit = user?.canEdit ?? true;

  const handleChange = (value: string | undefined) => {
    if (!value || !currentUser) return;
    
    setCode(value);
    socketService.sendTypingStart(currentUser.id);
    socketService.sendCodeChange(value, currentUser.id);
  };

  return (
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={handleChange}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          readOnly: !canEdit,
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
        }}
        loading={
          <div className="h-full flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      />
      
      {!canEdit && (
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
          View Only Mode
        </div>
      )}
    </div>
  );
}
