const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const gulp = require('gulp')
const fs = require('fs-extra')

gulp.reset = () => {
  gulp._registry._tasks = {}
}

const tasks = require('..')
const streamAsPromise = require('./stream-as-promise.js')

let logMock

describe('Build Js', () => {
  beforeEach(async () => {
    gulp.reset()
    logMock = sinon.spy(process.stdout, 'write')
    await fs.emptyDir('test/output')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Should compile basic js files', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = tasks['build-js'](gulp, 'test/input/build-valid/test.js', 'test/output/js', 'test.js')
    await streamAsPromise(buildJs())

    expect(await fs.pathExists('test/output/js/test.js')).to.equal(true)
    expect(await fs.pathExists('test/output/js/test.js.map')).to.equal(true)

    const js = await fs.readFile('test/output/js/test.js', 'utf8')
    expect(js).to.contain('function(r,e,n){console.log(25)')
  })

  it('Should show file size', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = tasks['build-js'](gulp, 'test/input/build-valid/test.js', 'test/output/js', 'test.js', true)

    await streamAsPromise(buildJs())
    expect(logMock.args[1][0]).to.contain('test.js.map')
    expect(logMock.args[1][0]).to.contain('gzipped')
    expect(logMock.args[3][0]).to.contain('test.js')
    expect(logMock.args[3][0]).to.contain('gzipped')
  })

  it('Should not show file size', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = tasks['build-js'](gulp, 'test/input/build-valid/test.js', 'test/output/js', 'test.js', false)

    await streamAsPromise(buildJs())

    expect(logMock).to.not.be.calledWith('\u001b[34mtest.js\u001b[39m \u001b[35m349 B\u001b[39m\u001b[90m (gzipped)\u001b[39m')
  })

  it('Should handle compile error', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = tasks['build-js'](gulp, 'test/input/build-invalid/test.js', 'test/output/js')

    try {
      await streamAsPromise(buildJs())
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('JS Build Errors')
    }

    expect(logMock.args[1][0]).to.equal('Unexpected token\n')
    expect(await fs.pathExists('test/output/js/test.js')).to.equal(false)
    expect(await fs.pathExists('test/output/js/test.js.map')).to.equal(false)
  })

  it('Should compile multiple entries into one file', async () => {
    expect(await fs.pathExists('test/output/js')).to.equal(false)
    const buildJs = tasks['build-js'](gulp, ['test/input/build-valid/test.js', 'test/input/build-valid/test-2.js'], 'test/output/js', undefined, true, ['moment'])

    await streamAsPromise(buildJs())

    expect(await fs.pathExists('test/output/js/bundle.js')).to.equal(true)
    expect(await fs.pathExists('test/output/js/bundle.js.map')).to.equal(true)

    const js = await fs.readFile('test/output/js/bundle.js', 'utf8')
    expect(js).to.contain('function(r,e,n){console.log(25)}')
    expect(js).to.contain('function(r,e,n){console.log(16)}')
  })
}).timeout(0)
