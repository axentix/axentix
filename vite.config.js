import { defineConfig } from 'vite';
import path from 'path';
import mpa from 'vite-plugin-mpa';

export default defineConfig({
  plugins: [
    mpa({
      scanDir: 'examples',
      open: '/examples/',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import 'src/core/mixins';
          @import 'src/core/functions';
          @import 'src/core/variables';
        `,
      },
    },
  },
  build: {
    outDir: 'dist/',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Axentix',
      formats: ['cjs', 'es', 'iife'],
      fileName: 'axentix',
    },
    rollupOptions: {
      output: {
        assetFileNames: `axentix.[ext]`,
      },
    },
  },
});
