import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from './Login';

describe('Login Page Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders login fields and labels correctly', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Verify presence of inputs and buttons
    expect(screen.getByLabelText('EMAIL ADDRESS')).toBeDefined();
    expect(screen.getByLabelText('PASSWORD')).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDefined();
  });

  it('displays validation error if form is submitted with empty fields', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Submit form without input values
    const form = screen.getByRole('form', { name: /Sign In Form/i });
    fireEvent.submit(form);

    // Verify validation error feedback is rendered
    expect(screen.getByText(/Please fill in all fields/i)).toBeDefined();
  });
});
