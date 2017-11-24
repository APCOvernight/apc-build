/**
 * [exports description]
 * @param  {Object}  gulp                         Gulp instance
 * @param  {Object}  config                       Config Object
 * @param  {String}  config.scssSrc               [description]
 * @param  {Array|String}  config.jsSrc           [description]
 * @param  {Array|String}  config.jsEntry         [description]
 * @param  {Array|String}  config.pugSrc          [description]
 * @param  {Array}   [config.scssIncludePaths=[]] [description]
 * @param  {String}  config.jsDest                [description]
 * @param  {String}  config.jsDestFilename        [description]
 * @param  {String}  config.cssDest               [description]
 * @param  {Array|String}  config.nodeSrc         [description]
 * @param  {Array|String}  config.imgSrc          [description]
 * @param  {String}  config.imgDest               [description]
 * @param  {Boolean} [config.showFileSizes=true]  [description]
 * @param  {Array}  config.browserifyIgnore       [description]
 * @return {Function}                             Register Watchers function
 */
module.exports = (gulp, config) => {
  require('./is-gulp')(gulp)

  if (!config || typeof config !== 'object') {
    throw new Error('Config object not passed')
  }

  const { scssSrc, jsSrc, jsEntry, pugSrc, scssIncludePaths = [], jsDest, jsDestFilename, cssDest, nodeSrc, imgSrc, imgDest, showFileSizes = true, browserifyIgnore } = config

  const watchers = []

  if (scssSrc) {
    gulp.task('lint-sass', require('./lint-sass')(gulp, scssSrc))
    watchers.push({source: scssSrc, tasks: ['lint-sass']})
  }

  if (scssSrc && cssDest) {
    gulp.task('build-sass', require('./build-sass')(gulp, scssSrc, cssDest, scssIncludePaths, showFileSizes))
    watchers.push({source: scssSrc, tasks: ['build-sass']})
  }

  if (pugSrc) {
    gulp.task('lint-pug', require('./lint-pug')(gulp, pugSrc))
    watchers.push({source: pugSrc, tasks: ['lint-pug']})
  }

  if (jsSrc) {
    gulp.task('lint-js', require('./lint-js')(gulp, jsSrc))
    watchers.push({source: jsSrc, tasks: ['lint-js']})
  }

  if (jsEntry && jsDest) {
    gulp.task('build-js', require('./build-js')(gulp, jsEntry, jsDest, jsDestFilename, showFileSizes, browserifyIgnore))
    watchers.push({source: jsSrc, tasks: ['build-js']})
  }

  if (nodeSrc) {
    gulp.task('lint-node', require('./lint-js')(gulp, nodeSrc))
    watchers.push({source: nodeSrc, tasks: ['lint-node']})
  }

  if (imgSrc && imgDest) {
    gulp.task('build-img', require('./build-img')(gulp, imgSrc, imgDest))
    watchers.push({source: imgSrc, tasks: ['build-img']})
  }

  return gulp => {
    require('./is-gulp')(gulp)

    watchers.forEach(watcher => {
      gulp.watch(watcher.source, watcher.tasks)
    })
  }
}
