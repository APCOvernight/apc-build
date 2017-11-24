const util = require('util')
const exec = util.promisify(require('child_process').exec)
const gutil = require('gulp-util')

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
    return exec(`sass-lint -v -q ${path}`)
      .then(() => {
        gutil.log('No Sass Lint Errors')
        return 0
      })
      .catch((err) => {
        const errors = err.stdout.split(/\n/g)
        errors.map(error => gutil.log(error))
        throw new gutil.PluginError({
          plugin: 'lint-sass',
          message: 'Sass Lint Errors'
        })
      })
  }
}
