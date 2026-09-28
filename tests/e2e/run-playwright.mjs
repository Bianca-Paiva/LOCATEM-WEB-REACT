import { spawn } from 'node:child_process';
import { createServer } from 'vite';

/*
 * Runner E2E local.
 * Sobe o Vite de forma explicita antes do Playwright e fecha o servidor ao fim,
 * evitando travamentos de teardown observados com webServer no Windows/Edge.
 */
const args = process.argv.slice(2);
let child;
let server;
let shuttingDown = false;

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (child && !child.killed) {
    child.kill();
  }

  if (server) {
    await server.close();
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => void shutdown(130));
process.on('SIGTERM', () => void shutdown(143));

server = await createServer({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();

child = spawn(
  process.execPath,
  ['./node_modules/@playwright/test/cli.js', 'test', ...args],
  {
    stdio: 'inherit',
    shell: false,
  },
);

child.on('exit', (code, signal) => {
  const exitCode = signal ? 1 : (code ?? 1);
  void shutdown(exitCode);
});
