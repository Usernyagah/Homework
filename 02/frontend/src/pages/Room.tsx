import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useRoomStore } from '@/stores/roomStore';
import { useChatStore } from '@/stores/chatStore';
import { useEditorStore } from '@/stores/editorStore';
import { mockSocket } from '@/services/mockSocket';
import { RoomHeader } from '@/components/room/RoomHeader';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { OutputConsole } from '@/components/editor/OutputConsole';
import { UsersList } from '@/components/room/UsersList';
import { ControlPanel } from '@/components/room/ControlPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { NicknameModal } from '@/components/room/NicknameModal';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { currentUser, setNickname } = useUserStore();
  const { addUser, clearRoom } = useRoomStore();
  const { clearMessages } = useChatStore();
  const { setCode } = useEditorStore();
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Check if user needs to enter nickname
    if (!currentUser?.nickname) {
      setShowNicknameModal(true);
    } else {
      joinRoom();
    }

    return () => {
      // Cleanup on unmount
      if (currentUser) {
        mockSocket.leaveRoom(currentUser.id);
      }
    };
  }, [roomId]);

  const joinRoom = () => {
    if (!currentUser || !roomId) return;
    
    mockSocket.connect();
    mockSocket.joinRoom(roomId, currentUser);
    toast.success(`Welcome to room ${roomId}!`);
  };

  const handleNicknameSubmit = (nickname: string) => {
    setNickname(nickname);
    setShowNicknameModal(false);
    
    // Join room after setting nickname
    setTimeout(() => {
      const user = useUserStore.getState().currentUser;
      if (user && roomId) {
        mockSocket.connect();
        mockSocket.joinRoom(roomId, user);
        toast.success(`Welcome, ${nickname}!`);
      }
    }, 100);
  };

  if (!roomId) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <NicknameModal open={showNicknameModal} onSubmit={handleNicknameSubmit} />
      
      <RoomHeader roomId={roomId} />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Editor & Output */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <CodeEditor />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={15}>
                <OutputConsole />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Users, Controls & Chat */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                <UsersList />
              </div>
              <ControlPanel />
              <ChatPanel />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
