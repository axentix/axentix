import { defineConfig } from 'vite';
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
});
