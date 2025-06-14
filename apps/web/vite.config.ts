import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mss-frontend/ui': path.resolve(__dirname, '../../packages/ui'),
      '@mss-frontend/store': path.resolve(__dirname, '../../packages/store'),
    },
  },
});
