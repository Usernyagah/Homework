import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockApi } from '@/services/mockApi';
import { useUserStore } from '@/stores/userStore';
import { Code2, Users, Play, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const { setNickname, setAsHost } = useUserStore();

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const hostId = uuidv4();
      const room = await mockApi.createRoom(hostId);
      setAsHost(true);
      navigate(`/room/${room.id}`);
      toast.success('Room created successfully!');
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = () => {
    const trimmedId = joinRoomId.trim();
    if (!trimmedId) {
      toast.error('Please enter a room ID');
      return;
    }
    setAsHost(false);
    navigate(`/room/${trimmedId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo & Title */}
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20">
              <Code2 className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Code</span>
              <span className="text-primary">Interview</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time collaborative coding interviews. Create a room, share the link, 
              and start coding together.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl border bg-card/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Live Code Editor</h3>
              <p className="text-sm text-muted-foreground">
                Monaco editor with syntax highlighting and real-time collaboration.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border bg-card/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                See who's typing, chat in real-time, and manage viewer permissions.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border bg-card/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Play className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Code Execution</h3>
              <p className="text-sm text-muted-foreground">
                Run JavaScript code directly in the browser and see results instantly.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={createRoom}
              disabled={isCreating}
              className="gap-2 h-14 px-8 text-lg"
            >
              {isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Code2 className="h-5 w-5" />
              )}
              Create Interview Room
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">or</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                className="h-14 w-48"
              />
              <Button
                variant="outline"
                size="lg"
                onClick={joinRoom}
                className="h-14 gap-2"
              >
                Join
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>Built for technical interviews. No account required.</p>
      </footer>
    </div>
  );
}
