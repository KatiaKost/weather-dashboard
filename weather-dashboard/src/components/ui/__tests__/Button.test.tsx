import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('applies primary variant styles by default', () => {
    render(<Button>Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  test('applies secondary variant styles', () => {
    render(<Button variant="secondary">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-900');
  });
});