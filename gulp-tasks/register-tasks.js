
module.exports = (gulp, { scssSrc, jsSrc, jsEntry, pugSrc, scssIncludePaths = [], jsDest, cssDest, nodeSrc, imgSrc, imgDest, showFileSizes = true, browserifyIgnore }) => {
  const watchers = []

  if (scssSrc) {
    gulp.task('sass-lint', require('./sass-lint')(gulp, scssSrc))
    watchers.push({source: scssSrc, tasks: ['sass-lint']})
  }

  if (scssSrc && cssDest) {
    gulp.task('build-sass', require('./build-sass')(gulp, scssSrc, cssDest, scssIncludePaths, showFileSizes))
    watchers.push({source: scssSrc, tasks: ['build-sass']})
  }

  if (pugSrc) {
    gulp.task('pug-lint', require('./pug-lint')(gulp, pugSrc))
    watchers.push({source: pugSrc, tasks: ['pug-lint']})
  }

  if (jsSrc) {
    gulp.task('js-lint', require('./js-lint')(gulp, jsSrc))
    watchers.push({source: jsSrc, tasks: ['js-lint']})
  }

  if (jsEntry && jsDest) {
    gulp.task('build-js', require('./build-js')(gulp, jsEntry, jsDest, showFileSizes, browserifyIgnore))
    watchers.push({source: jsSrc, tasks: ['build-js']})
  }

  if (nodeSrc) {
    gulp.task('node-lint', require('./js-lint')(gulp, nodeSrc))
    watchers.push({source: nodeSrc, tasks: ['node-lint']})
  }

  if (imgSrc && imgDest) {
    gulp.task('build-img', require('./build-img')(gulp, imgSrc, imgDest))
    watchers.push({source: imgSrc, tasks: ['build-img']})
  }

  return gulp => {
    watchers.forEach(watcher => {
      gulp.watch(watcher.source, watcher.tasks)
    })
  }
}
