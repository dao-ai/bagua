import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // The suite renders three.js components under jsdom, so a fully loaded
    // machine can stretch a single test well past Vitest's 5s default and fail
    // an assertion that actually passes. Observed once on a laptop that was
    // busy elsewhere (suite clock 22s -> 85s, environment total 88s -> 387s).
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
