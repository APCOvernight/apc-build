const imagemin = require('gulp-imagemin')

/**
 *
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Input source(s)
 * @param  {String}       dest Output Destination
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path, dest) => {
  require('./is-gulp')(gulp)

  return () => {
    return new Promise((resolve, reject) => {
      gulp.src(path)
        .pipe(imagemin())
        .pipe(gulp.dest(dest))
        .on('end', () => resolve('Images built'))
    })
  }
}
