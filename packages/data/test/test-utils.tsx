import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup para componentes com Mantine
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: { 
  //       retry: false, 
  //       cacheTime: 0,
  //       staleTime: 0,
  //       refetchOnWindowFocus: false
  //     },
  //     mutations: { retry: false }
  //   }
  // });
  
  return (
    // <QueryClientProvider client={queryClient}>
      <MantineProvider>
        {children}
      </MantineProvider>
    // </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, AllTheProviders };

// Mock para localStorage
import { vi } from 'vitest';

export const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: vi.fn(() => {
    mockLocalStorage.store = {};
  })
};

// Mock para sessionStorage
export const mockSessionStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => mockSessionStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockSessionStorage.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockSessionStorage.store[key];
  }),
  clear: vi.fn(() => {
    mockSessionStorage.store = {};
  })
};

// Setup global mocks
beforeEach(() => {
  // Reset storage mocks
  mockLocalStorage.store = {};
  mockSessionStorage.store = {};
  
  // Mock window.localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
  
  // Mock window.sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true
  });
  
  // Mock console warnings for tests
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Cleanup mocks
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
