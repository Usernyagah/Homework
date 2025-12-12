import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import { useUserStore } from '@/stores/userStore';

const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

describe('Home Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.setState({ currentUser: null });
  });

  it('should render the home page correctly', () => {
    const { getByText } = render(
      <MemoryRouter future={routerFutureFlags}>
        <Home />
      </MemoryRouter>
    );
    
    expect(getByText('Code')).toBeDefined();
    expect(getByText('Interview')).toBeDefined();
    expect(getByText('Create Interview Room')).toBeDefined();
  });

  it('should have a join room input', () => {
    const { getByPlaceholderText } = render(
      <MemoryRouter future={routerFutureFlags}>
        <Home />
      </MemoryRouter>
    );
    
    const input = getByPlaceholderText('Enter room ID');
    expect(input).toBeDefined();
  });

  it('should display feature cards', () => {
    const { getByText } = render(
      <MemoryRouter future={routerFutureFlags}>
        <Home />
      </MemoryRouter>
    );
    
    expect(getByText('Live Code Editor')).toBeDefined();
    expect(getByText('Team Collaboration')).toBeDefined();
    expect(getByText('Code Execution')).toBeDefined();
  });
});
