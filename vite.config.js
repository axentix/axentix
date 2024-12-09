import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import mpaPlugin from 'vite-plugin-mpa';

// @ts-expect-error
const mpa = mpaPlugin.default;

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
