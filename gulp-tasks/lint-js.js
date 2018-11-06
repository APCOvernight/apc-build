const eslint = require('gulp-eslint')
const log = require('fancy-log')
const gulpError = require('./_gulp-error')

/**
 * Lint js files using eslint
 *
 * @function lint-js
 *
 * @param  {Object}       gulp Gulp instance
 * @param  {Array|String} path Path[s] of Js files to lint
 * @return {Function}          Gulp task
 *
 * @example
 * const gulp = require('gulp')
 * const tasks = require('apc-build')
 *
 * gulp.task('lint-js', tasks['lint-js'](gulp, ['src/js/*']))
 */
module.exports = (gulp, path) => {
  require('./is-gulp')(gulp)

  return () => {
    return gulp.src(path)
      .pipe(eslint())
      .pipe(eslint.format('stylish'))
      .pipe(eslint.results(results => {
        if (!results.errorCount && !results.warningCount) {
          log('No JS Lint Errors')
        } else {
          throw gulpError('lint-js', 'JS Lint Errors')
        }
      }))
  }
}
