import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '@/App';

describe('App', () => {
  it('muestra el catálogo público a un invitado', () => {
    render(<App />);
    expect(screen.getByText(/Gestión de eventos/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver eventos/i })).toHaveAttribute(
      'href',
      '/events',
    );
  });
});
