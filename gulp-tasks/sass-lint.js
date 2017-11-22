const exec = require('child_process').exec

/**
 * Execute sass-lint command and throw if there are errors (unless in watch mode)
 * @param  {Object}       gulp Instance of gulp
 * @return {Function}          Gulp task
 */
module.exports = gulp => {
  return done => {
    exec('sass-lint -v', (err, stdout) => {
      console.log(stdout || 'No Sass Lint Errors')
      done(process.argv.length > 2 ? err : 0)
    })
  }
}
