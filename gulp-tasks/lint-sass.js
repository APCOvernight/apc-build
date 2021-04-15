const util = require('util')
const exec = util.promisify(require('child_process').exec)
const log = require('fancy-log')

const splitLog = require('./_split-log')
const gulpError = require('./_gulp-error')

/**
 * Lint sass files using sass-lint
 *
 * @function lint-sass
 *
 * @param  {Object}       gulp Gulp instance
 * @param  {String}       path Path of Sass files to lint and/or build
 * @return {Function}          Gulp task
 *
 * @example
 * const gulp = require('gulp')
 * const tasks = require('apc-build')
 *
 * gulp.task('lint-sass', tasks['lint-sass'](gulp, 'src/scss/*'))
 */
module.exports = (gulp, path) => {
  require('./is-gulp')(gulp)

  return () => {
    return exec(`node_modules/.bin/sass-lint -v -q ${path}`)
      .then(() => {
        log('No Sass Lint Errors')
        return 0
      })
      .catch((err) => {
        splitLog(err.stdout)
        throw gulpError('lint-sass', 'Sass Lint Errors')
      })
  }
}
