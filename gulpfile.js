const { src, dest, watch, series, parallel } = require('gulp'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  minify = require('gulp-babel-minify'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  Fiber = require('fibers');

sass.compiler = require('sass');

function compileJSMinified() {
  return src('src/js/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('axentix.min.js'))
    .pipe(
      minify({
        mangle: {
          keepClassName: true
        }
      })
    )
    .pipe(dest('dist/js/'));
}

function compileJS() {
  return src('src/js/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('axentix.js'))
    .pipe(dest('dist/js/'));
}

function compileSassMinified() {
  return src('src/scss/*.scss')
    .pipe(sass({ fiber: Fiber, outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/css/'));
}

function compileSass() {
  return src('src/scss/*.scss')
    .pipe(sass({ fiber: Fiber }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(dest('dist/css/'));
}

function initBrowserSync() {
  browserSync.init({
    server: './'
  });
  watch(['examples/**/*.html', 'examples/**/*.css', 'examples/**/*.js']).on('change', browserSync.reload);
}

exports.jsmin = compileJSMinified;
exports.js = compileJS;
exports.sassmin = compileSassMinified;
exports.sass = compileSass;

exports.watch = function() {
  initBrowserSync();
  watch('src/js/**/*.js', series(compileJSMinified, compileJS)).on('change', browserSync.reload);
  watch('src/scss/**/*.scss', series(compileSassMinified, compileSass)).on('change', browserSync.reload);
};

exports.watchjs = function() {
  initBrowserSync();
  watch('src/js/**/*.js', series(compileJSMinified, compileJS)).on('change', browserSync.reload);
};

exports.watchsass = function() {
  initBrowserSync();
  watch('src/scss/**/*.scss', series(compileSassMinified, compileSass)).on('change', browserSync.reload);
};

exports.default = parallel(series(compileJSMinified, compileJS), series(compileSassMinified, compileSass));
