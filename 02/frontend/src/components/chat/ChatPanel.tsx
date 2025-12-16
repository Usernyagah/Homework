import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useUserStore } from '@/stores/userStore';
import { socketService } from '@/services/socketService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatPanelProps {
  roomId: string;
}

export function ChatPanel({ roomId }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const { messages } = useChatStore();
  const { currentUser } = useUserStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!message.trim()) {
      console.warn('[ChatPanel] Cannot send empty message');
      return;
    }
    
    if (!currentUser) {
      console.error('[ChatPanel] No current user - cannot send message');
      return;
    }
    
    if (!roomId) {
      console.error('[ChatPanel] No roomId - cannot send message');
      return;
    }
    
    if (!socketService.isConnected()) {
      console.warn('[ChatPanel] Socket not connected - attempting to connect');
      socketService.connect();
      // Wait a bit for connection, then try again
      setTimeout(() => {
        if (socketService.isConnected()) {
          socketService.sendChatMessage(roomId, {
            userId: currentUser.id,
            nickname: currentUser.nickname,
            content: message.trim(),
          });
          setMessage('');
        } else {
          console.error('[ChatPanel] Still not connected - message not sent');
        }
      }, 500);
      return;
    }
    
    console.log('[ChatPanel] Sending message:', { roomId, userId: currentUser.id, content: message.trim() });
    
    socketService.sendChatMessage(roomId, {
      userId: currentUser.id,
      nickname: currentUser.nickname,
      content: message.trim(),
    });
    
    setMessage('');
  };

  return (
    <div className="flex flex-col h-64 border-t">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Chat</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-1",
                msg.userId === currentUser?.id && "items-end"
              )}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">
                  {msg.userId === currentUser?.id ? 'You' : msg.nickname}
                </span>
                <span>{format(new Date(msg.timestamp), 'HH:mm')}</span>
              </div>
              <div
                className={cn(
                  "px-3 py-2 rounded-lg text-sm max-w-[85%]",
                  msg.userId === currentUser?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={currentUser ? "Type a message..." : "Enter nickname to chat"}
          className="flex-1 h-9"
          disabled={!currentUser}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e as any);
            }
          }}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="h-9 w-9" 
          disabled={!message.trim() || !currentUser || !socketService.isConnected()}
          title={!socketService.isConnected() ? "Connecting..." : "Send message"}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
