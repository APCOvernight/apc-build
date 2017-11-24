const imagemin = require('gulp-imagemin')

/**
 * Copy and compress images with imagemin
 *
 * @function build-img
 *
 * @param  {Object}       gulp Gulp instance
 * @param  {Array|String} path Path[s] for image files to be built
 * @param  {String}       dest Output Destination
 * @return {Function}          Gulp task
 *
 * @example
 * const gulp = require('gulp')
 * const tasks = require('apc-build')
 *
 * gulp.task('build-img', tasks['build-img'](gulp, ['src/img/*'], 'dist/img'))
 */
module.exports = (gulp, path, dest) => {
  require('./is-gulp')(gulp)

  return () => {
    return gulp.src(path)
      .pipe(imagemin())
      .pipe(gulp.dest(dest))
  }
}
