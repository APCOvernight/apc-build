const eslint = require('gulp-eslint')
const gutil = require('gulp-util')

/**
 * Execute eslint and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Path(s) of pug files to lint
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path) => {
  require('./is-gulp')(gulp)

  return () => {
    return new Promise((resolve, reject) => {
      gulp.src(path)
        .pipe(eslint('apc'))
        .pipe(eslint.format('stylish'))
        .pipe(eslint.failAfterError())
        .on('error', () => {
          reject(new gutil.PluginError({
            plugin: 'lint-js',
            message: 'JS Lint Errors'
          }))
        })
        .pipe(eslint.results(() => {
          gutil.log('No JS Lint Errors')
          resolve('No JS Lint Errors')
        }))
    })
  }
}
