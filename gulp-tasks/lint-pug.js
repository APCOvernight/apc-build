const pugLint = require('gulp-pug-linter')
const gutil = require('gulp-util')
const splitLog = require('./_split-log')
const gulpError = require('./_gulp-error')

/**
 * Lint pug files using pug linter
 *
 * @function lint-pug
 *
 * @param  {Object}       gulp Gulp instance
 * @param  {Array|String} path Path[s] of pug files to lint
 * @return {Function}          Gulp task
 *
 * @example
 * const gulp = require('gulp')
 * const tasks = require('apc-build')
 *
 * gulp.task('lint-pug', tasks['lint-pug'](gulp, ['app/views/*.pug']))
 */
module.exports = (gulp, path) => {
  require('./is-gulp')(gulp)

  return () => {
    return gulp.src(path)
      .pipe(pugLint())
      .pipe(pugLint.reporter(errors => {
        if (errors.length) {
          errors.map(error => splitLog(error.message))
          throw gulpError('lint-pug', 'Pug Lint Errors')
        } else {
          gutil.log('No Pug Lint Errors')
        }
      }))
  }
}
