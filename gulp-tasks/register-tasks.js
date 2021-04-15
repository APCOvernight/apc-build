'use strict'

const watchers = []
const tasks = []

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
const register = (gulp, config) => {
  require('./is-gulp')(gulp)

  if (!config || typeof config !== 'object') {
    throw new Error('Config object not passed')
  }

  const { scssSrc, jsSrc, jsEntry, pugSrc, scssIncludePaths = [], jsDest, jsDestFilename, cssDest, imgSrc, imgDest, showFileSizes = true, browserifyIgnore } = config

  scssSrc && registerTask(gulp, 'lint-sass', scssSrc)

  scssSrc && cssDest && registerTask(gulp, 'build-sass', scssSrc, cssDest, scssIncludePaths, showFileSizes)

  pugSrc && registerTask(gulp, 'lint-pug', pugSrc)

  jsSrc && registerTask(gulp, 'lint-js', jsSrc)

  jsEntry && jsDest && registerTask(gulp, 'build-js', jsEntry, jsDest, jsDestFilename, showFileSizes, browserifyIgnore)

  imgSrc && imgDest && registerTask(gulp, 'build-img', imgSrc, imgDest)

  return {
    tasks,
    registerWatchers: registerWatchers(watchers)
  }
}

/**
 * Register a task against the given gulp task
 * @param  {Object} gulp Gulp instance
 * @param  {String} name Name of task
 * @param  {Mixed} args Passed to gulp task
 */
const registerTask = (gulp, name, ...args) => {
  gulp.task(name, require(`./${name}`)(gulp, ...args))
  tasks.push(name)
  watchers.push({
    source: args[0],
    tasks: [name]
  })
}

/**
 * Register watchers corresponding to the tasks already set up
 *
 * @function register.registerWatchers
 *
 * @param  {Array} watchers Gulp instance
 * @return {Function}
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
const registerWatchers = watchers => {
  /**
   * @param  {Object} gulp Gulp instance
   */
  return gulp => {
    require('./is-gulp')(gulp)

    watchers.forEach(watcher => {
      gulp.watch(watcher.source, watcher.tasks)
    })
  }
}

module.exports = register
