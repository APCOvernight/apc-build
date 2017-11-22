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
  nodeSrc: '*.js',
  showFileSizes: true,
  imgSrc: 'src/**/*',
  imgDest: 'output/img'
}

const registerWatchers = require('./gulp-tasks/register-tasks')(gulp, config)

gulp.task('default', () => {
  registerWatchers(gulp)
})
