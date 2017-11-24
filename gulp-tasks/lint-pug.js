const pugLint = require('gulp-pug-linter')
const gutil = require('gulp-util')

/**
 * Execute gulp-lint-puger and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Path(s) of pug files to lint
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path) => {
  require('./is-gulp')(gulp)

  return () => {
    return gulp.src(path)
      .pipe(pugLint())
      .pipe(pugLint.reporter(errors => {
        if (errors.length) {
          errors.map(error => {
            const lines = error.message.split(/\n/g)
            lines.map(line => gutil.log(line))
          })
          throw new gutil.PluginError({
            plugin: 'lint-pug',
            message: 'Pug Lint Errors'
          })
        } else {
          gutil.log('No Pug Lint Errors')
        }
      }))
  }
}
