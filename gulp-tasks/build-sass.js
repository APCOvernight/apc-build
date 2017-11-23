const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const postcss = require('gulp-postcss')
const mqpacker = require('css-mqpacker')
const gulpif = require('gulp-if')
const size = require('gulp-size')
const gutil = require('gulp-util')

/**
 * Execute lint-sass command and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Input source(s)
 * @param  {String}       dest Output Destination
 * @param  {Array}        scssIncludePaths Sass include paths (for frameworks etc)
 * @param  {Boolean}      showFileSizes Show file sizes in output
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path, dest, scssIncludePaths, showFileSizes) => {
  require('./is-gulp')(gulp)

  return () => {
    return new Promise((resolve, reject) => {
      gulp.src(path)
        .pipe(sourcemaps.init())
        .pipe(
          sass({
            includePaths: scssIncludePaths,
            outputStyle: 'compressed'
          }).on('error', error => {
            const lines = error.message.split(/\n/g)
            lines.map(line => gutil.log(line))
            reject(new gutil.PluginError({
              plugin: 'build-sass',
              message: 'Sass Build Errors'
            }))
          })
        )
        .pipe(
          autoprefixer({
            browsers: [ 'last 2 versions', 'ie >= 9' ]
          })
        )
        .pipe(postcss([mqpacker]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulpif(showFileSizes, size({showFiles: true, showTotal: false, gzip: true})))
        .pipe(gulp.dest(dest))
        .on('end', () => resolve('Sass Built!'))
    })
  }
}
