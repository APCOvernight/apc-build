const eslint = require('gulp-eslint')

/**
 * Execute eslint and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Path(s) of pug files to lint
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path) => {
  return () => {
    return gulp.src(path)
      .pipe(eslint('apc'))
      .pipe(eslint.format('stylish'))
      .pipe(eslint.failAfterError())
  }
}
