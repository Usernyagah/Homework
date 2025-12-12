import { useNavigate } from 'react-router-dom';
import { Copy, Moon, Sun, LogOut, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editorStore';
import { useRoomStore } from '@/stores/roomStore';
import { toast } from 'sonner';
import { useState } from 'react';

interface RoomHeaderProps {
  roomId: string;
}

export function RoomHeader({ roomId }: RoomHeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useEditorStore();
  const { clearRoom } = useRoomStore();
  const [copied, setCopied] = useState(false);

  const copyRoomLink = async () => {
    const link = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Room link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const leaveRoom = () => {
    clearRoom();
    navigate('/');
    toast.info('You have left the room');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Room:</span>
          <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">
            {roomId}
          </code>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyRoomLink}
          className="gap-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {theme === 'vs-dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={leaveRoom}
          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Leave
        </Button>
      </div>
    </header>
  );
}
