import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import type React from 'react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/server';

/*
 * Setup global do Vitest.
 * Centraliza MSW, limpeza de DOM/storage e mocks de APIs do navegador para que
 * cada teste comece isolado e sem depender de backend real.
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash = '';
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

vi.mock('swiper/react', () => ({
  Swiper: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div onClick={onClick}>{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('swiper/css', () => ({}));
vi.mock('swiper/css/pagination', () => ({}));
