const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const sassError = require('gulp-sass-error').gulpSassError
const autoprefixer = require('gulp-autoprefixer')
const postcss = require('gulp-postcss')
const mqpacker = require('css-mqpacker')
const gulpif = require('gulp-if')
const size = require('gulp-size')

/**
 * Execute sass-lint command and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @param  {Array|String} path Input source(s)
 * @param  {String}       dest Output Destination
 * @param  {Array}        scssIncludePaths Sass include paths (for frameworks etc)
 * @param  {Boolean}      showFileSizes Show file sizes in output
 * @return {Function}          Gulp task
 */
module.exports = (gulp, path, dest, scssIncludePaths, showFileSizes) => {
  return () => {
    return gulp.src(path)
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          includePaths: scssIncludePaths,
          outputStyle: 'compressed'
        })
        .on('error', sassError(process.argv.length > 2))
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
  }
}
