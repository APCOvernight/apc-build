const util = require('util')
const exec = util.promisify(require('child_process').exec)
const gutil = require('gulp-util')

/**
 * Execute lint-sass command and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {String}       path Path of files to lint
 * @return {Function}          Gulp task
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
