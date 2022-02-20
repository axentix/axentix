const autoprefixer = require('autoprefixer');

const config = (name, filepath = '') => {
  if (filepath) filepath = filepath.replace('src/', '').replace('index.ts', '');

  return {
    plugins: [],
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
      emptyOutDir: false,
      outDir: 'dist/',
      target: 'es6',
      lib: {
        name: name,
        formats: ['es', 'umd'],
        fileName: (format) =>
          format === 'umd' ? `${name.toLowerCase()}.min.js` : `${name.toLowerCase()}.esm.js`,
      },
      rollupOptions: {
        output: {
          assetFileNames: `${name.toLowerCase()}.min.[ext]`,
          dir: `dist/${filepath}`,
        },
      },
    },
  };
};

module.exports = {
  config,
};
