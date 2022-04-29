const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const debug = require('gulp-debug')
const webserver = require('gulp-webserver')
const zip = require('gulp-zip')

let jsGlob = ['js/**/*.js', '!js/vendor/**']
let scssGlob = ['style/**/*.scss']

function convertScss() {
  return gulp
    .src(scssGlob)
    .pipe(debug({ title: 'processing:', showCount: false }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/style'))
}

function convertJS() {
  return gulp
    .src(jsGlob)
    .pipe(debug({ title: 'processing:', showCount: false }))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
        comments: false
      })
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
}

function devServer() {
  return gulp.src('/').pipe(
    webserver({
      fallback: 'index.html',

      // TODO: disabled because of performance issue
      livereload: false,

      directoryListing: false,
      open: false,
      path: '/'
    })
  )
}

function deliver() {
  return gulp.src([
    '**/*.html',
    '**/*.js',
    '**/*.css',
    '!js',
    '!style',
    '!gulpfile.js',
    '!node_modules/**/*.html',
    '!node_modules/**/*.js',
    '!node_modules/**/*.css',
  ])
  .pipe(zip('archive.zip', {
    
  }))
  .pipe(gulp.dest('./'))
}

// one-time build
exports.build = gulp.parallel(convertScss, convertJS)

// dev
exports.dev = gulp.parallel(function ConvertScss() {
  gulp.watch(scssGlob, convertScss)
}, function ConvertJS() {
  gulp.watch(jsGlob, convertJS)
}, devServer)

// deliver the code
exports.zip = gulp.series(deliver)