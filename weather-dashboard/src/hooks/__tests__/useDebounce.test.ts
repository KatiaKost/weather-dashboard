import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

// Используем реальные таймеры для тестов
jest.useFakeTimers();

describe('useDebounce', () => {
  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  test('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'first', delay: 500 }
      }
    );

    expect(result.current).toBe('first');

    // Меняем значение
    rerender({ value: 'second', delay: 500 });
    
    // Значение не должно измениться до истечения таймера
    expect(result.current).toBe('first');
  });

  test('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'start', delay: 500 }
      }
    );

    rerender({ value: 'updated', delay: 500 });
    
    // Прошло время
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(result.current).toBe('updated');
  });

  test('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    const { unmount } = renderHook(
      () => useDebounce('test', 500)
    );

    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});