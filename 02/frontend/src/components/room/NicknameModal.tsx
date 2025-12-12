import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface NicknameModalProps {
  open: boolean;
  onSubmit: (nickname: string) => void;
}

export function NicknameModal({ open, onSubmit }: NicknameModalProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    
    if (trimmed.length < 2) {
      setError('Nickname must be at least 2 characters');
      return;
    }
    
    if (trimmed.length > 20) {
      setError('Nickname must be 20 characters or less');
      return;
    }
    
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Enter Your Nickname
          </DialogTitle>
          <DialogDescription>
            Choose a nickname to identify yourself in the interview room.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Your nickname..."
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              autoFocus
              className="h-12 text-lg"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full h-11">
            Join Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
