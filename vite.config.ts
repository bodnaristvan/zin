import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  publicDir: './public/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: '/Users/serif/src/fun/zin/index.html',
      output: {
        // Single HTML file output
        manualChunks: () => 'everything',
      },
    },
  },
})
