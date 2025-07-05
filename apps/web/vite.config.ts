import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Polyfill for global and Buffer
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mss-frontend/ui': path.resolve(__dirname, '../../packages/ui'),
      '@mss-frontend/store': path.resolve(__dirname, '../../packages/store'),
      buffer: require.resolve('buffer/'),
    },
  },
  optimizeDeps: {
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
