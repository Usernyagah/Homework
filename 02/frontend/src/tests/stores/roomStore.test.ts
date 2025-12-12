import { describe, it, expect, beforeEach } from 'vitest';
import { useRoomStore } from '@/stores/roomStore';
import type { User } from '@/types';

const mockUser: User = {
  id: 'user-1',
  nickname: 'TestUser',
  isHost: false,
  isTyping: false,
  canEdit: true,
  joinedAt: new Date(),
};

describe('roomStore', () => {
  beforeEach(() => {
    useRoomStore.setState({ room: null, users: [], error: null, isConnecting: false });
  });

  it('should add a user', () => {
    const { addUser } = useRoomStore.getState();
    addUser(mockUser);
    
    const { users } = useRoomStore.getState();
    expect(users).toHaveLength(1);
    expect(users[0].nickname).toBe('TestUser');
  });

  it('should remove a user', () => {
    const { addUser, removeUser } = useRoomStore.getState();
    addUser(mockUser);
    removeUser('user-1');
    
    const { users } = useRoomStore.getState();
    expect(users).toHaveLength(0);
  });

  it('should update user typing status', () => {
    const { addUser, setUserTyping } = useRoomStore.getState();
    addUser(mockUser);
    setUserTyping('user-1', true);
    
    const { users } = useRoomStore.getState();
    expect(users[0].isTyping).toBe(true);
  });

  it('should toggle user edit permission', () => {
    const { addUser, toggleUserEditPermission } = useRoomStore.getState();
    addUser(mockUser);
    toggleUserEditPermission('user-1');
    
    const { users } = useRoomStore.getState();
    expect(users[0].canEdit).toBe(false);
  });

  it('should not duplicate users when adding same user twice', () => {
    const { addUser } = useRoomStore.getState();
    addUser(mockUser);
    addUser({ ...mockUser, nickname: 'UpdatedName' });
    
    const { users } = useRoomStore.getState();
    expect(users).toHaveLength(1);
    expect(users[0].nickname).toBe('UpdatedName');
  });
});
