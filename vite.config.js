import { defineConfig } from 'vite';
import path from 'path';
import mpa from 'vite-plugin-mpa';
import autoprefixer from 'autoprefixer';

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
    postcss: {
      plugins: [autoprefixer],
    },
  },
  build: {
    outDir: 'dist/',
    target: 'es6',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Axentix',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'umd' ? 'axentix.min.js' : 'axentix.esm.js'),
    },
    rollupOptions: {
      output: {
        assetFileNames: `axentix.min.[ext]`,
      },
    },
  },
});
