/**
 * Test if object is an instance of gulp
 *
 * @function is-gulp
 *
 * @param  {Object} gulp Gulp instance
 * @throws {Error}       Gulp instance not passed
 */
module.exports = gulp => {
  if (!gulp || !gulp.constructor || gulp.constructor.name !== 'Gulp') {
    throw new Error('Gulp instance not passed')
  }
}
