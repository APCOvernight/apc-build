const gutil = require('gulp-util')

/**
 * Split stdout output by line and log using gulp-util
 * @param  {String} stdout Output from command
 * @return {Array}         Array of logged errors
 */
module.exports = stdout => {
  const errors = stdout.split(/\n/g)
  return errors.map(error => gutil.log(error))
}
