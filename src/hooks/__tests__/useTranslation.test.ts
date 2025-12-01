import { renderHook } from '@testing-library/react';
import { useTranslation } from '../useTranslation';

describe('useTranslation', () => {
  test('returns Russian translation object', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current).toBeDefined();
    expect(result.current.headers).toBeDefined();
    expect(result.current.headers.weatherDashboard).toBe('Погодный Дашборд');
    expect(result.current.buttons.search).toBe('Поиск');
    expect(result.current.weatherDescriptions.clear).toBe('ясно');
  });

  test('has all required translation keys', () => {
    const { result } = renderHook(() => useTranslation());
    
    const t = result.current;
    
    // Проверяем основные разделы
    expect(t.common).toBeDefined();
    expect(t.headers).toBeDefined();
    expect(t.descriptions).toBeDefined();
    expect(t.weather).toBeDefined();
    expect(t.units).toBeDefined();
    expect(t.days).toBeDefined();
    expect(t.errors).toBeDefined();
    expect(t.buttons).toBeDefined();
    expect(t.weatherDescriptions).toBeDefined();
    
    // Проверяем несколько ключевых значений
    expect(typeof t.common.loading).toBe('string');
    expect(typeof t.headers.currentWeather).toBe('string');
    expect(typeof t.weather.temperature).toBe('string');
  });
});