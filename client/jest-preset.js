/* eslint-disable no-unused-vars */
// jest-preset.js
import { defineConfig } from 'vite';
import { mergeConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // other Vite-specific options
  },
});
