const pugLint = require('gulp-pug-linter')

/**
 * Execute gulp-pug-linter and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Path(s) of pug files to lint
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path) => {
  return () => {
    return gulp.src(path)
      .pipe(pugLint())
      .pipe(pugLint.reporter(process.argv.length > 2 ? 'fail' : null))
  }
}
