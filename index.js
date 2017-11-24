module.exports = {
  register: require('./gulp-tasks/register-tasks'),
  'build-js': require('./gulp-tasks/build-js'),
  'build-sass': require('./gulp-tasks/build-sass'),
  'build-img': require('./gulp-tasks/build-img'),
  'lint-js': require('./gulp-tasks/lint-js'),
  'lint-sass': require('./gulp-tasks/lint-sass'),
  'lint-pug': require('./gulp-tasks/lint-pug')
}
