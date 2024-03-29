const glob = require('fast-glob');
const { build } = require('vite');
const { config } = require('./config');
const { resolve } = require('path');
const { visualizer } = require('rollup-plugin-visualizer');

const buildComponent = async (filepath) => {
  const fileSplitted = filepath.split('/');
  const name = filepath.endsWith('select.ts')
    ? fileSplitted[fileSplitted.length - 1].replace('.ts', '')
    : fileSplitted[fileSplitted.length - 2];
  const c = config(name[0].toUpperCase() + name.slice(1), filepath);

  c.build.lib.entry = resolve(__dirname, `../${filepath}`);
  if (filepath.endsWith('select.ts'))
    c.build.rollupOptions.output.dir = `dist/${filepath.replace('src/', '').replace('select.ts', '')}`;

  await build(c);
};

const buildUtil = async (filepath) => {
  const fileSplitted = filepath.split('/');
  const name = fileSplitted[fileSplitted.length - 1].replace('.ts', '');
  const c = config(name[0].toUpperCase() + name.slice(1), filepath);

  c.build.lib.entry = resolve(__dirname, `../${filepath}`);
  c.build.rollupOptions.output.dir = 'dist/utils';

  await build(c);
};

const buildMain = async (filepath) => {
  const c = config('Axentix');
  c.build.emptyOutDir = true;
  c.build.lib.entry = resolve(__dirname, `../${filepath}`);
  c.build.lib.fileName = (format) => (format === 'umd' ? 'axentix.min.js' : 'axentix.esm.js');
  c.build.rollupOptions.output.assetFileNames = 'axentix.min.[ext]';
  c.build.rollupOptions.plugins = [visualizer({ gzipSize: true, title: 'Axentix Stats' })];

  await build(c);
};

if (process.argv[2] === 'main') buildMain('src/index.ts');
else {
  glob('{**/**/index.ts,src/utils/*.ts,src/**/select.ts}').then(async (files) => {
    const mainPath = files.find((f) => f === 'src/index.ts' && f.split('/')[1] !== 'utils');
    await buildMain(mainPath);

    Promise.all(
      files.filter((f) => f !== 'src/index.ts' && f.split('/')[1] !== 'utils').map((f) => buildComponent(f))
    );

    Promise.all(
      files.filter((f) => f !== 'src/index.ts' && f.split('/')[1] === 'utils').map((f) => buildUtil(f))
    );
  });
}
