const eslint = require('gulp-eslint')
const gutil = require('gulp-util')

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
      .pipe(eslint('apc'))
      .pipe(eslint.format('stylish'))
      .pipe(eslint.results(results => {
        if (!results.errorCount && !results.warningCount) {
          gutil.log('No JS Lint Errors')
        } else {
          throw new gutil.PluginError({
            plugin: 'lint-js',
            message: 'JS Lint Errors'
          })
        }
      }))
  }
}
