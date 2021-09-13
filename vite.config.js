import { defineConfig } from 'vite';
import path from 'path';
import mpa from 'vite-plugin-mpa';

const plugins =
  process.env.NODE_ENV === 'production'
    ? []
    : [
        mpa({
          scanDir: 'examples',
          open: '/examples/',
        }),
      ];

export default defineConfig({
  plugins,
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
    target: 'es6',
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
