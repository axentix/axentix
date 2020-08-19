const { src, dest, watch, series, parallel } = require('gulp'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  minify = require('gulp-babel-minify'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  insert = require('gulp-insert'),
  deporder = require('gulp-deporder'),
  Fiber = require('fibers');

sass.compiler = require('sass');

function definitionExport() {
  return src('src/axentix.d.ts').pipe(dest('dist'));
}

function compileJSESM() {
  return src('dist/js/axentix.js')
    .pipe(rename('axentix.esm.js'))
    .pipe(insert.prepend('export { Axentix };'))
    .pipe(dest('dist/js/'));
}

function compileJSMinified() {
  return src('src/js/**/*.js')
    .pipe(deporder())
    .pipe(concat('axentix.min.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(
      minify({
        mangle: {
          keepClassName: true,
        },
      })
    )
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream());
}

function compileJS() {
  return src('src/js/**/*.js')
    .pipe(deporder())
    .pipe(concat('axentix.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream());
}

function compileSassMinified() {
  return src('src/scss/*.scss')
    .pipe(sass({ fiber: Fiber, outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/css/'))
    .pipe(browserSync.stream());
}

function compileSass() {
  return src('src/scss/*.scss')
    .pipe(sass({ fiber: Fiber }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(dest('dist/css/'))
    .pipe(browserSync.stream());
}

function initBrowserSync() {
  browserSync.init({
    server: './',
  });
  watch(['examples/**/*.html', 'examples/**/*.css', 'examples/**/*.js']).on('change', browserSync.reload);
}

exports.jsmin = compileJSMinified;
exports.js = compileJS;
exports.sassmin = compileSassMinified;
exports.sass = compileSass;
exports.jsesm = compileJSESM;

exports.watch = function () {
  initBrowserSync();
  watch('src/js/**/*.js', series(compileJSMinified, compileJS));
  watch('src/scss/**/*.scss', series(compileSassMinified, compileSass));
};

exports.watchjs = function () {
  initBrowserSync();
  watch('src/js/**/*.js', series(compileJSMinified, compileJS));
};

exports.watchsass = function () {
  initBrowserSync();
  watch('src/scss/**/*.scss', series(compileSassMinified, compileSass));
};

exports.default = parallel(
  series(parallel(compileJSMinified, compileJS), compileJSESM),
  compileSassMinified,
  compileSass,
  definitionExport
);
