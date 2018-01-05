const uglify = require('gulp-uglify')
const browserify = require('browserify')
const babel = require('gulp-babel')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const splitLog = require('./_split-log')
const gulpError = require('./_gulp-error')

/**
 * Bundle and browserify front end JS files
 *
 * @function build-js
 *
 * @param  {Object}  gulp                       Gulp instance
 * @param  {String|Array}  entries              Path[s] of Js files to build
 * @param  {String}  dest                       Destination for Js built files
 * @param  {String}  [destFilename='bundle.js'] Filename for built Js file
 * @param  {Boolean} [showFileSizes=true]       Show file sizes in console output?
 * @param  {Array}   [browserifyIgnore=[]]      Browserify paths to ignore
 * @return {Function}                           Gulp task
 *
 * @example
 * const gulp = require('gulp')
 * const tasks = require('apc-build')
 *
 * gulp.task('build-js', tasks['build-js'](gulp, ['src/js/entry.js'], 'dist/js', 'bundle.js'))
 */
module.exports = (gulp, entries, dest, destFilename = 'bundle.js', showFileSizes = true, browserifyIgnore = []) => {
  require('./is-gulp')(gulp)

  return () => {
    if (!Array.isArray(entries)) {
      entries = [entries]
    }

    const b = browserify({ entries })

    b.ignore(browserifyIgnore)

    return b.bundle()
      .on('error', error => {
        splitLog(error.message)
        throw gulpError('build-js', 'JS Build Errors')
      })
      .pipe(source(destFilename))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(babel({presets: ['env']}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulpif(showFileSizes, size({showFiles: true, showTotal: false, gzip: true})))
      .pipe(gulp.dest(dest))
  }
}
