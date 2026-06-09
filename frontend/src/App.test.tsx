import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component Basic Render', () => {
  it('should compile and mount the application without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.querySelector('.app-container')).toBeDefined();
  });
});
