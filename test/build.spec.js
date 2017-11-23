
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const gulp = require('gulp')
const fs = require('fs-extra')

let logMock

describe('Build Sass', () => {
  beforeEach(async () => {
    gulp.reset()
    logMock = sinon.stub(require('gulp-util'), 'log')
    await fs.emptyDir('test/output')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Should compile basic sass files', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = require('../gulp-tasks/build-sass')(gulp, 'test/input/build-valid/test.scss', 'test/output/css')
    const res = await buildSass()
    expect(res).to.equal('Sass Built!')
    expect(await fs.pathExists('test/output/css/test.css')).to.equal(true)
    expect(await fs.pathExists('test/output/css/test.css.map')).to.equal(true)

    const css = await fs.readFile('test/output/css/test.css', 'utf8')
    expect(css).to.contain('p{font-size:25px}')
  })

  it('Should handle compile error', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = require('../gulp-tasks/build-sass')(gulp, 'test/input/build-invalid/test.scss', 'test/output/css')

    try {
      await buildSass()
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Sass Build Errors')
    }

    expect(logMock).to.be.calledWith('Error: 25px*px isn\'t a valid CSS value.')
    expect(await fs.pathExists('test/output/css/test.css')).to.equal(false)
    expect(await fs.pathExists('test/output/css/test.css.map')).to.equal(false)
  })

  it('Should fail if sass paths aren\'t included', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = require('../gulp-tasks/build-sass')(gulp, 'test/input/build-valid/test-foundation.scss', 'test/output/css', '')

    try {
      await buildSass()
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Sass Build Errors')
    }

    expect(logMock).to.be.calledWith('Error: File to import not found or unreadable: util/mixins.')

    expect(await fs.pathExists('test/output/css/test-foundation.css')).to.equal(false)
    expect(await fs.pathExists('test/output/css/test-foundation.css.map')).to.equal(false)
  })

  it('Should include sass paths', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = require('../gulp-tasks/build-sass')(gulp, 'test/input/build-valid/test-foundation.scss', 'test/output/css', ['node_modules/foundation-sites/scss'])
    const res = await buildSass()
    expect(res).to.equal('Sass Built!')

    expect(await fs.pathExists('test/output/css/test-foundation.css')).to.equal(true)
    expect(await fs.pathExists('test/output/css/test-foundation.css.map')).to.equal(true)

    const css = await fs.readFile('test/output/css/test-foundation.css', 'utf8')
    expect(css).to.contain('p{font-size:25px}')
  })

  it('Should show file size', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = require('../gulp-tasks/build-sass')(gulp, 'test/input/build-valid/test.scss', 'test/output/css', [], true)
    await buildSass()
    expect(logMock).to.be.calledWith('\u001b[34mtest.css\u001b[39m \u001b[35m76 B\u001b[39m\u001b[90m (gzipped)\u001b[39m')
  })

  it('Should not show file size', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = require('../gulp-tasks/build-sass')(gulp, 'test/input/build-valid/test.scss', 'test/output/css', [], false)
    await buildSass()
    expect(logMock).to.not.be.calledWith('\u001b[34mtest.css\u001b[39m \u001b[35m76 B\u001b[39m\u001b[90m (gzipped)\u001b[39m')
  })
})

describe('Build Js', () => {
  beforeEach(async () => {
    gulp.reset()
    logMock = sinon.stub(require('gulp-util'), 'log')
    await fs.emptyDir('test/output')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Should compile basic js files', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = require('../gulp-tasks/build-js')(gulp, 'test/input/build-valid/test.js', 'test/output/js')
    const res = await buildJs()
    expect(res[0]).to.equal('test/input/build-valid/test.js built')
    expect(await fs.pathExists('test/output/js/test.js')).to.equal(true)
    expect(await fs.pathExists('test/output/js/test.js.map')).to.equal(true)

    const js = await fs.readFile('test/output/js/test.js', 'utf8')
    expect(js).to.contain('function(r,e,n){console.log(25)')
  })

  it('Should show file size', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = require('../gulp-tasks/build-js')(gulp, 'test/input/build-valid/test.js', 'test/output/js', true)
    await buildJs()
    expect(logMock).to.be.calledWith('\u001b[34mtest.js\u001b[39m \u001b[35m349 B\u001b[39m\u001b[90m (gzipped)\u001b[39m')
  })

  it('Should not show file size', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = require('../gulp-tasks/build-js')(gulp, 'test/input/build-valid/test.js', 'test/output/js', false)
    await buildJs()
    expect(logMock).to.not.be.calledWith('\u001b[34mtest.js\u001b[39m \u001b[35m349 B\u001b[39m\u001b[90m (gzipped)\u001b[39m')
  })

  it('Should handle compile error', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = require('../gulp-tasks/build-js')(gulp, 'test/input/build-invalid/test.js', 'test/output/js')

    try {
      await buildJs()
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('JS Build Errors')
    }

    expect(logMock).to.be.calledWith('Unexpected token')
    expect(await fs.pathExists('test/output/js/test.js')).to.equal(false)
    expect(await fs.pathExists('test/output/js/test.js.map')).to.equal(false)
  })

  it('Should compile multiple js files', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = require('../gulp-tasks/build-js')(gulp, ['test/input/build-valid/test.js', 'test/input/build-valid/test-2.js'], 'test/output/js', true, ['moment'])
    const res = await buildJs()
    expect(res[0]).to.equal('test/input/build-valid/test.js built')
    expect(await fs.pathExists('test/output/js/test.js')).to.equal(true)
    expect(await fs.pathExists('test/output/js/test.js.map')).to.equal(true)

    const js = await fs.readFile('test/output/js/test.js', 'utf8')
    expect(js).to.contain('function(r,e,n){console.log(25)')

    expect(res[1]).to.equal('test/input/build-valid/test-2.js built')
    expect(await fs.pathExists('test/output/js/test-2.js')).to.equal(true)
    expect(await fs.pathExists('test/output/js/test-2.js.map')).to.equal(true)

    const js2 = await fs.readFile('test/output/js/test-2.js', 'utf8')
    expect(js2).to.contain('function(r,e,n){console.log(16)')
  })
})

describe('Build Images', () => {
  beforeEach(async () => {
    gulp.reset()
    logMock = sinon.stub(require('gulp-util'), 'log')
    await fs.emptyDir('test/output')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Should move and minify images', async () => {
    expect(await fs.pathExists('test/output/img')).to.equal(false)
    const buildImg = require('../gulp-tasks/build-img')(gulp, 'test/input/build-valid/*', 'test/output/img')
    const res = await buildImg()

    expect(res).to.equal('Images built')
    expect(await fs.pathExists('test/output/img/test.jpg')).to.equal(true)
    expect(logMock).to.be.calledWith('gulp-imagemin:')
  })
})
