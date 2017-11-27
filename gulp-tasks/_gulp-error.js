const gutil = require('gulp-util')

/**
 * Generate a gulp plugin error
 * @param  {String} plugin  Plugin name
 * @param  {String} message Error message
 * @return {Error}          PluginError
 */
module.exports = (plugin, message) => {
  return new gutil.PluginError({
    plugin,
    message
  })
}
