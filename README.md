# APC Build Tools

[![Greenkeeper badge](https://badges.greenkeeper.io/APCOvernight/apc-build.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/APCOvernight/apc-build.svg?branch=master)](https://travis-ci.org/APCOvernight/apc-build) [![Coverage Status](https://coveralls.io/repos/github/APCOvernight/apc-build/badge.svg?branch=master)](https://coveralls.io/github/APCOvernight/apc-build?branch=master)

Gulp build scripts for front end APC projects

- [APC Build Tools](#apc-build-tools)
  * [Task register helpers](#task-register-helpers)
  * [Gulp tasks](#gulp-tasks)
  * [Utilities](#utilities)

## Task register helpers

<a name="register"></a>

## register(gulp, config) ⇒ <code>Object</code>
Register gulp tasks based on a passed config object

**Returns**: <code>Object</code> - registerWatchers function and array of registered task names  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| gulp | <code>Object</code> |  | Gulp instance |
| config | <code>Object</code> |  | Config Object |
| config.scssSrc | <code>String</code> |  | Path of Sass files to lint and/or build |
| config.jsSrc | <code>Array</code> \| <code>String</code> |  | Path[s] of Js files to lint |
| config.jsEntry | <code>Array</code> \| <code>String</code> |  | Path[s] of Js files to build |
| config.pugSrc | <code>Array</code> \| <code>String</code> |  | Path[s] of pug files to lint |
| [config.scssIncludePaths] | <code>Array</code> | <code>[]</code> | SCSS include paths (for frameworks etc) |
| config.jsDest | <code>String</code> |  | Destination for Js built files |
| config.jsDestFilename | <code>String</code> |  | Filename for built Js file |
| config.cssDest | <code>String</code> |  | Destination for built CSS |
| config.jsSrc | <code>Array</code> \| <code>String</code> |  | Path[s] of Js files to lint |
| config.imgSrc | <code>Array</code> \| <code>String</code> |  | Path[s] for image files to be built |
| config.imgDest | <code>String</code> |  | Destination for built image files |
| [config.showFileSizes] | <code>Boolean</code> | <code>true</code> | Show file sizes in console output? |
| config.browserifyIgnore | <code>Array</code> |  | Browserify paths to ignore |

**Example**  
```js
const gulp = require('gulp')

const register = require('apc-build').register(gulp, {
  scssSrc: 'src/**\/*.scss',
  scssIncludePaths: [],
  cssDest: 'output/css',
  showFileSizes: true
})

console.log(register)
// Returns
// {
//   tasks: [ 'lint-sass', 'build-sass' ],
//   registerWatchers: [Function: registerWatchers]
// }
```
<a name="register.registerWatchers"></a>

### register.registerWatchers(gulp)
Register watchers corresponding to the tasks already set up

**Kind**: method of [<code>register</code>] return(#register)  

| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |

**Example**  
```js
const gulp = require('gulp')

const register = require('apc-build').register(gulp, config)

// Watchers corresponding to config values
// will be registered within watch task
gulp.task('watch', () => {
  register.registerWatchers(gulp)
})
```

## Gulp tasks

<dl>
<dt><a href="#build-img">build-img(gulp, path, dest)</a> ⇒ <code>function</code></dt>
<dd><p>Copy and compress images with imagemin</p>
</dd>
<dt><a href="#build-js">build-js(gulp, entries, dest, [destFilename], [showFileSizes], [browserifyIgnore])</a> ⇒ <code>function</code></dt>
<dd><p>Bundle and browserify front end JS files</p>
</dd>
<dt><a href="#build-sass">build-sass(gulp, path, dest, scssIncludePaths, showFileSizes)</a> ⇒ <code>function</code></dt>
<dd><p>Compile sass files</p>
</dd>
<dt><a href="#lint-js">lint-js(gulp, path)</a> ⇒ <code>function</code></dt>
<dd><p>Lint js files using eslint</p>
</dd>
<dt><a href="#lint-pug">lint-pug(gulp, path)</a> ⇒ <code>function</code></dt>
<dd><p>Lint pug files using pug linter</p>
</dd>
<dt><a href="#lint-sass">lint-sass(gulp, path)</a> ⇒ <code>function</code></dt>
<dd><p>Lint sass files using sass-lint</p>
</dd>
</dl>

<a name="build-img"></a>

## build-img(gulp, path, dest) ⇒ <code>function</code>
Copy and compress images with imagemin

**Returns**: <code>function</code> - Gulp task  

| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |
| path | <code>Array</code> \| <code>String</code> | Path[s] for image files to be built |
| dest | <code>String</code> | Output Destination |

**Example**  
```js
const gulp = require('gulp')
const tasks = require('apc-build')

gulp.task('build-img', tasks['build-img'](gulp, ['src/img/*'], 'dist/img'))
```
<a name="build-js"></a>

## build-js(gulp, entries, dest, [destFilename], [showFileSizes], [browserifyIgnore]) ⇒ <code>function</code>
Bundle and browserify front end JS files

**Returns**: <code>function</code> - Gulp task  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| gulp | <code>Object</code> |  | Gulp instance |
| entries | <code>String</code> \| <code>Array</code> |  | Path[s] of Js files to build |
| dest | <code>String</code> |  | Destination for Js built files |
| [destFilename] | <code>String</code> | <code>&#x27;bundle.js&#x27;</code> | Filename for built Js file |
| [showFileSizes] | <code>Boolean</code> | <code>true</code> | Show file sizes in console output? |
| [browserifyIgnore] | <code>Array</code> | <code>[]</code> | Browserify paths to ignore |

**Example**  
```js
const gulp = require('gulp')
const tasks = require('apc-build')

gulp.task('build-js', tasks['build-js'](gulp, ['src/js/entry.js'], 'dist/js', 'bundle.js'))
```
<a name="build-sass"></a>

## build-sass(gulp, path, dest, scssIncludePaths, showFileSizes) ⇒ <code>function</code>
Compile sass files

**Returns**: <code>function</code> - Gulp task  

| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |
| path | <code>Array</code> \| <code>String</code> | Path of Sass files to build |
| dest | <code>String</code> | Destination for built CSS |
| scssIncludePaths | <code>Array</code> | Sass include paths (for frameworks etc) |
| showFileSizes | <code>Boolean</code> | Show file sizes in console output? |

**Example**  
```js
const gulp = require('gulp')
const tasks = require('apc-build')

gulp.task('build-sass', tasks['build-sass'](gulp, ['src/scss/*.scss'], 'dist/css', ['node_modules/foundation-sites/scss']))
```

<a name="lint-js"></a>

## lint-js(gulp, path) ⇒ <code>function</code>
Lint js files using eslint

**Returns**: <code>function</code> - Gulp task  

| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |
| path | <code>Array</code> \| <code>String</code> | Path[s] of Js files to lint |

**Example**  
```js
const gulp = require('gulp')
const tasks = require('apc-build')

gulp.task('lint-js', tasks['lint-js'](gulp, ['src/js/*']))
```
<a name="lint-pug"></a>

## lint-pug(gulp, path) ⇒ <code>function</code>
Lint pug files using pug linter

**Returns**: <code>function</code> - Gulp task  

| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |
| path | <code>Array</code> \| <code>String</code> | Path[s] of pug files to lint |

**Example**  
```js
const gulp = require('gulp')
const tasks = require('apc-build')

gulp.task('lint-pug', tasks['lint-pug'](gulp, ['app/views/*.pug']))
```
<a name="lint-sass"></a>

## lint-sass(gulp, path) ⇒ <code>function</code>
Lint sass files using sass-lint

**Returns**: <code>function</code> - Gulp task  

| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |
| path | <code>String</code> | Path of Sass files to lint and/or build |

**Example**  
```js
const gulp = require('gulp')
const tasks = require('apc-build')

gulp.task('lint-sass', tasks['lint-sass'](gulp, 'src/scss/*'))
```

## Utilities

<a name="is-gulp"></a>

## is-gulp(gulp)
Test if object is an instance of gulp

**Throws**:

- <code>Error</code> Gulp instance not passed


| Param | Type | Description |
| --- | --- | --- |
| gulp | <code>Object</code> | Gulp instance |
