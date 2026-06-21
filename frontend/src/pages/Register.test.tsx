import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Register } from './Register';

describe('Register Page Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders registration fields and labels correctly', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthProvider>
    );

    // Verify fields exist using exact label text to avoid aria-label button overrides
    expect(screen.getByLabelText('FULL NAME')).toBeDefined();
    expect(screen.getByLabelText('EMAIL ADDRESS')).toBeDefined();
    expect(screen.getByLabelText('PASSWORD')).toBeDefined();
    expect(screen.getByLabelText('CONFIRM PASSWORD')).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeDefined();
  });

  it('displays error if passwords do not match', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthProvider>
    );

    // Fill in inputs with mismatched passwords
    fireEvent.change(screen.getByLabelText('FULL NAME'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('EMAIL ADDRESS'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('CONFIRM PASSWORD'), { target: { value: 'different123' } });

    // Submit form
    const form = screen.getByRole('form', { name: /Registration Form/i });
    fireEvent.submit(form);

    // Verify validation feedback
    expect(screen.getByText(/Passwords do not match/i)).toBeDefined();
  });
});
