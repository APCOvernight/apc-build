const imagemin = require('gulp-imagemin')

/**
 *
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Input source(s)
 * @param  {String}       dest Output Destination
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path, dest) => {
  return () => {
    return gulp.src(path)
     .pipe(imagemin())
     .pipe(gulp.dest(dest))
  }
}
