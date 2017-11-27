/**
 * Register gulp tasks based on a passed config object
 *
 * @function register
 *
 * @param  {Object}  gulp                         Gulp instance
 * @param  {Object}  config                       Config Object
 * @param  {String}  config.scssSrc               Path of Sass files to lint and/or build
 * @param  {Array|String}  config.jsSrc           Path[s] of Js files to lint
 * @param  {Array|String}  config.jsEntry         Path[s] of Js files to build
 * @param  {Array|String}  config.pugSrc          Path[s] of pug files to lint
 * @param  {Array}   [config.scssIncludePaths=[]] SCSS include paths (for frameworks etc)
 * @param  {String}  config.jsDest                Destination for Js built files
 * @param  {String}  config.jsDestFilename        Filename for built Js file
 * @param  {String}  config.cssDest               Destination for built CSS
 * @param  {Array|String}  config.jsSrc           Path[s] of Js files to lint
 * @param  {Array|String}  config.imgSrc          Path[s] for image files to be built
 * @param  {String}  config.imgDest               Destination for built image files
 * @param  {Boolean} [config.showFileSizes=true]  Show file sizes in console output?
 * @param  {Array}  config.browserifyIgnore       Browserify paths to ignore
 * @return {Object}                               registerWatchers function and array of registered task names
 *
 * @example
 * const gulp = require('gulp')
 *
 * const register = require('apc-build').register(gulp, {
 *   scssSrc: 'src/**\/*.scss',
 *   scssIncludePaths: [],
 *   cssDest: 'output/css',
 *   showFileSizes: true
 * })
 *
 * console.log(register)
 * // Returns
 * // {
 * //   tasks: [ 'lint-sass', 'build-sass' ],
 * //   registerWatchers: [Function: registerWatchers]
 * // }
 *
 */
module.exports = (gulp, config) => {
  require('./is-gulp')(gulp)

  if (!config || typeof config !== 'object') {
    throw new Error('Config object not passed')
  }

  const { scssSrc, jsSrc, jsEntry, pugSrc, scssIncludePaths = [], jsDest, jsDestFilename, cssDest, imgSrc, imgDest, showFileSizes = true, browserifyIgnore } = config

  const watchers = []
  const tasks = []

  const registerTask = (name, ...args) => {
    gulp.task(name, require(`./${name}`)(gulp, ...args))
    tasks.push(name)
    watchers.push({
      source: args[0],
      tasks: [name]
    })
  }

  if (scssSrc) {
    registerTask('lint-sass', scssSrc)
  }

  if (scssSrc && cssDest) {
    registerTask('build-sass', scssSrc, cssDest, scssIncludePaths, showFileSizes)
  }

  if (pugSrc) {
    registerTask('lint-pug', pugSrc)
  }

  if (jsSrc) {
    registerTask('lint-js', jsSrc)
  }

  if (jsEntry && jsDest) {
    registerTask('build-js', jsEntry, jsDest, jsDestFilename, showFileSizes, browserifyIgnore)
  }

  if (imgSrc && imgDest) {
    registerTask('build-img', imgSrc, imgDest)
  }

  /**
   * Register watchers corresponding to the tasks already set up
   *
   * @function register.registerWatchers
   *
   * @param  {Object} gulp Gulp instance
   *
   * @example
   * const gulp = require('gulp')
   *
   * const register = require('apc-build').register(gulp, config)
   *
   * // Watchers corresponding to config values
   * // will be registered within watch task
   * gulp.task('watch', () => {
   *   register.registerWatchers(gulp)
   * })
   *
   */
  const registerWatchers = gulp => {
    require('./is-gulp')(gulp)

    watchers.forEach(watcher => {
      gulp.watch(watcher.source, watcher.tasks)
    })
  }

  return {
    tasks,
    registerWatchers
  }
}
