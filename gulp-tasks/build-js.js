const uglify = require('gulp-uglify')
const browserify = require('browserify')
const babel = require('gulp-babel')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const gutil = require('gulp-util')
const path = require('path')

module.exports = (gulp, entries, dest, showFileSizes, browserifyIgnore = []) => {
  require('./is-gulp')(gulp)

  return () => {
    if (!Array.isArray(entries)) {
      entries = [entries]
    }
    const promises = entries.map(entry => {
      return new Promise((resolve, reject) => {
        const b = browserify()

        browserifyIgnore.map(ignore => {
          b.ignore(ignore)
        })

        b.add(entry)

        b.bundle()
          .on('error', error => {
            const lines = error.message.split(/\n/g)
            lines.map(line => gutil.log(line))
            reject(new gutil.PluginError({
              plugin: 'build-js',
              message: 'JS Build Errors'
            }))
          })
          .pipe(source(path.basename(entry)))
          .pipe(buffer())
          .pipe(sourcemaps.init())
          .pipe(babel({presets: ['env']}))
          .pipe(uglify())
          .pipe(sourcemaps.write('./'))
          .pipe(gulpif(showFileSizes, size({showFiles: true, showTotal: false, gzip: true})))
          .pipe(gulp.dest(dest))
          .on('end', () => resolve(`${entry} built`))
      })
    })
    return Promise.all(promises)
  }
}
