import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@sim': path.resolve(__dirname, 'src/sim'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@scenario': path.resolve(__dirname, 'src/scenario')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts']
  }
});
