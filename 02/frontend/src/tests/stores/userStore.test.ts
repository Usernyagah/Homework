import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/stores/userStore';

describe('userStore', () => {
  beforeEach(() => {
    useUserStore.setState({ currentUser: null });
  });

  it('should set nickname and create user', () => {
    const { setNickname } = useUserStore.getState();
    setNickname('TestUser');
    
    const { currentUser } = useUserStore.getState();
    expect(currentUser).not.toBeNull();
    expect(currentUser?.nickname).toBe('TestUser');
    expect(currentUser?.isTyping).toBe(false);
    expect(currentUser?.canEdit).toBe(true);
  });

  it('should set user as host', () => {
    const { setNickname, setAsHost } = useUserStore.getState();
    setNickname('HostUser');
    setAsHost(true);
    
    const { currentUser } = useUserStore.getState();
    expect(currentUser?.isHost).toBe(true);
  });

  it('should clear user', () => {
    const { setNickname, clearUser } = useUserStore.getState();
    setNickname('TestUser');
    clearUser();
    
    const { currentUser } = useUserStore.getState();
    expect(currentUser).toBeNull();
  });
});
