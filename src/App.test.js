import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const e1 = screen.getByText(/Felipe Alves Barbosa/i);
  const e2 = screen.getByText(/Gabriel Allen Anareta/i);
  const e3 = screen.getByText(/Jaryd Pohorelic/i);
  const e4 = screen.getByText(/Luis Marlou Sy/i);
  expect(e1).toBeInTheDocument();
  expect(e2).toBeInTheDocument();
  expect(e3).toBeInTheDocument();
  expect(e4).toBeInTheDocument();
});
