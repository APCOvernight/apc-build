const uglify = require('gulp-uglify')
const browserify = require('browserify')
const babel = require('gulp-babel')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const gutil = require('gulp-util')

module.exports = (gulp, entries, dest, destFilename = 'bundle.js', showFileSizes, browserifyIgnore = []) => {
  require('./is-gulp')(gulp)

  return () => {
    if (!Array.isArray(entries)) {
      entries = [entries]
    }

    const b = browserify({
      entries
    })

    browserifyIgnore.map(ignore => {
      b.ignore(ignore)
    })

    return b.bundle()
      .on('error', error => {
        const lines = error.message.split(/\n/g)
        lines.map(line => gutil.log(line))
        throw new gutil.PluginError({
          plugin: 'build-js',
          message: 'JS Build Errors'
        })
      })
      .pipe(source(destFilename))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(babel({presets: ['env']}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulpif(showFileSizes, size({showFiles: true, showTotal: false, gzip: true})))
      .pipe(gulp.dest(dest))
  }
}
