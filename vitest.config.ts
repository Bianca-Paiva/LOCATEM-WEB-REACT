import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/*
 * Configuracao dos testes unitarios e de integracao.
 * Reaproveita o Vite do projeto, executa componentes em jsdom e deixa
 * os testes E2E fora do Vitest porque eles rodam pelo Playwright.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setupTests.tsx'],
      exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/**/*.types.ts',
          'src/**/*.mock.ts',
          'src/assets/**',
        ],
      },
    },
  }),
);
