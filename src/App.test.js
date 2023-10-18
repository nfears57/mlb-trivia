import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MLB Trivia title', () => {
  render(<App />);
  const titleElement = screen.getByText(/MLB Trivia/i);
  expect(titleElement).toBeInTheDocument();
});
