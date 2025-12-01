import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders loading spinner', () => {
    render(<LoadingSpinner />);
    
    // Ищем контейнер по классу или data-testid
    const container = screen.getByTestId('loading-spinner-container');
    expect(container).toBeInTheDocument();
    
    // Проверяем, что спиннер присутствует
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('border-b-2');
    expect(spinner).toHaveClass('border-blue-600');
  });

  test('container has correct flex classes', () => {
    render(<LoadingSpinner />);
    
    const container = screen.getByTestId('loading-spinner-container');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('justify-center');
    expect(container).toHaveClass('items-center');
  });
});