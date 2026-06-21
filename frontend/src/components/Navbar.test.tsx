import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from './Navbar';

describe('Navbar Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders brand name and default links when user is guest', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    // Verify brand title is rendered
    expect(screen.getByText(/CarbonSentry/i)).toBeDefined();

    // Verify guest links are rendered
    expect(screen.getByText(/Login/i)).toBeDefined();
    expect(screen.getByText(/Register/i)).toBeDefined();
  });
});
