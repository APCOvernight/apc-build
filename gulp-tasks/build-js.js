const uglify = require('gulp-uglify')
const browserify = require('browserify')
const babel = require('gulp-babel')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const path = require('path')

module.exports = (gulp, entry, dest, showFileSizes, browserifyIgnore) => {
  return () => {
    if (!Array.isArray(entry)) {
      entry = [entry]
    }
    return entry.map(e => {
      const b = browserify()

      browserifyIgnore.map(ignore => {
        b.ignore(ignore)
      })

      b.add(e)

      return b.bundle()
        .pipe(source(path.basename(e)))
        .pipe(buffer())
        .pipe(sourcemaps.init())
          .pipe(babel({presets: ['env']}))
          .pipe(uglify().on('error', uglify => {
            console.error(uglify.message)
          }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulpif(showFileSizes, size({showFiles: true, showTotal: false, gzip: true})))
        .pipe(gulp.dest(dest))
    })
  }
}
