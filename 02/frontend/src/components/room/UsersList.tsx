import { useRoomStore } from '@/stores/roomStore';
import { useUserStore } from '@/stores/userStore';
import { Crown, Edit3, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function UsersList() {
  const { users, toggleUserEditPermission } = useRoomStore();
  const { currentUser } = useUserStore();
  const isHost = currentUser?.isHost;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Connected Users ({users.length})
      </h3>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              "bg-card/50 hover:bg-card/80 transition-colors",
              user.id === currentUser?.id && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                user.isHost 
                  ? "bg-amber-500/20 text-amber-400" 
                  : "bg-primary/20 text-primary"
              )}>
                {user.nickname.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {user.nickname}
                    {user.id === currentUser?.id && (
                      <span className="text-muted-foreground text-xs ml-1">(you)</span>
                    )}
                  </span>
                  {user.isHost && (
                    <Crown className="h-4 w-4 text-amber-400" />
                  )}
                </div>
                
                {user.isTyping && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Edit3 className="h-3 w-3 animate-pulse" />
                    typing...
                  </span>
                )}
              </div>
            </div>

            {isHost && user.id !== currentUser?.id && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleUserEditPermission(user.id)}
                  >
                    {user.canEdit ? (
                      <Eye className="h-4 w-4 text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {user.canEdit ? 'Set to view-only' : 'Allow editing'}
                </TooltipContent>
              </Tooltip>
            )}
            
            {!user.canEdit && !isHost && user.id !== currentUser?.id && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                View only
              </span>
            )}
          </div>
        ))}
        
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No users connected yet
          </p>
        )}
      </div>
    </div>
  );
}
