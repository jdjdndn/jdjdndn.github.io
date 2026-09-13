import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'inject-build-date',
      transformIndexHtml(html) {
        const today = new Date().toISOString().slice(0, 10);
        return html.replace('__BUILD_DATE__', today);
      },
    },
  ],
});
