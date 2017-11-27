const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const postcss = require('gulp-postcss')
const mqpacker = require('css-mqpacker')
const gulpif = require('gulp-if')
const size = require('gulp-size')
const splitLog = require('./_split-log')
const gulpError = require('./_gulp-error')

/**
 * Compile sass files
 *
 * @function build-sass
 *
 * @param  {Object}       gulp              Gulp instance
 * @param  {Array|String} path              Path of Sass files to build
 * @param  {String}       dest              Destination for built CSS
 * @param  {Array}        scssIncludePaths  Sass include paths (for frameworks etc)
 * @param  {Boolean}      showFileSizes     Show file sizes in console output?
 * @return {Function}                       Gulp task
 *
 * @example
 * const gulp = require('gulp')
 * const tasks = require('apc-build')
 *
 * gulp.task('build-sass', tasks['build-sass'](gulp, ['src/scss/*.scss'], 'dist/css', ['node_modules/foundation-sites/scss']))
 */
module.exports = (gulp, path, dest, scssIncludePaths, showFileSizes = true) => {
  require('./is-gulp')(gulp)

  return () => {
    return gulp.src(path)
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          includePaths: scssIncludePaths,
          outputStyle: 'compressed'
        }).on('error', error => {
          splitLog(error.message)
          throw gulpError('build-sass', 'Sass Build Errors')
        })
      )
      .pipe(
        autoprefixer({ browsers: [ 'last 2 versions', 'ie >= 9' ] })
      )
      .pipe(postcss([mqpacker]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulpif(showFileSizes, size({showFiles: true, showTotal: false, gzip: true})))
      .pipe(gulp.dest(dest))
  }
}
