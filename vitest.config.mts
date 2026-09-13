import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * The tests are plain Node: the harness, the judge, the store and the
 * authored data are all pure. Anything that needs a Worker or a DOM belongs
 * in the browser, not here.
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
