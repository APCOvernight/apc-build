module.exports = gulp => {
  if (!gulp || !gulp.constructor || gulp.constructor.name !== 'Gulp') {
    throw new Error('Gulp instance not passed')
  }
}
