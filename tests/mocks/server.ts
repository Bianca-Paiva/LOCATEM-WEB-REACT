import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Servidor MSW usado pelo Vitest em ambiente Node/jsdom.
export const server = setupServer(...handlers);
