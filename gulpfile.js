const gulp = require('gulp')

const config = {
  jsSrc: 'src/**/*.js',
  jsEntry: ['src/test.js', 'src/another.js'],
  browserifyIgnore: ['moment'],
  pugSrc: 'src/**/*.pug',
  scssSrc: 'src/**/*.scss',
  scssIncludePaths: [],
  jsDest: 'output/js',
  cssDest: 'output/css',
  showFileSizes: true,
  imgSrc: 'src/**/*',
  imgDest: 'output/img'
}

const register = require('./').register(gulp, config)
console.info('Registered tasks:\n', register.tasks)

gulp.task('default', () => {
  register.registerWatchers(gulp)
})
