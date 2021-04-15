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
const streamAsPromise = require('./stream-as-promise')

let logMock

describe('Build Sass', () => {
  beforeEach(async () => {
    gulp.reset()
    logMock = sinon.spy(process.stdout, 'write')
    await fs.emptyDir('test/output')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Should compile basic sass files', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = tasks['build-sass'](gulp, 'test/input/build-valid/test.scss', 'test/output/css')

    await streamAsPromise(buildSass())

    expect(await fs.pathExists('test/output/css/test.css')).to.equal(true)
    expect(await fs.pathExists('test/output/css/test.css.map')).to.equal(true)

    const css = await fs.readFile('test/output/css/test.css', 'utf8')
    expect(css).to.contain('p{font-size:25px}')
  })

  it('Should handle compile error', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = tasks['build-sass'](gulp, 'test/input/build-invalid/test.scss', 'test/output/css')

    try {
      await streamAsPromise(buildSass())
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.have.string('Sass Build Errors')
    }

    expect(logMock.getCall(3).args[0]).to.equal('Error: 25px*px isn\'t a valid CSS value.\n')
    expect(await fs.pathExists('test/output/css/test.css')).to.equal(false)
    expect(await fs.pathExists('test/output/css/test.css.map')).to.equal(false)
  })

  it('Should fail if sass paths aren\'t included', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = tasks['build-sass'](gulp, 'test/input/build-valid/test-foundation.scss', 'test/output/css', '')

    try {
      await streamAsPromise(buildSass())
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.dartException.message).to.equal('Sass Build Errors')
    }
    expect(logMock.getCall(3).args[0]).to.equal('Error: Can\'t find stylesheet to import.\n')
    expect(await fs.pathExists('test/output/css/test-foundation.css')).to.equal(false)
    expect(await fs.pathExists('test/output/css/test-foundation.css.map')).to.equal(false)
  })

  it('Should include sass paths', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = tasks['build-sass'](gulp, 'test/input/build-valid/test-foundation.scss', 'test/output/css', ['node_modules/foundation-sites/scss'])

    await streamAsPromise(buildSass())

    expect(await fs.pathExists('test/output/css/test-foundation.css')).to.equal(true)
    expect(await fs.pathExists('test/output/css/test-foundation.css.map')).to.equal(true)

    const css = await fs.readFile('test/output/css/test-foundation.css', 'utf8')
    expect(css).to.contain('p{font-size:25px}')
  })

  it('Should show file size', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = tasks['build-sass'](gulp, 'test/input/build-valid/test.scss', 'test/output/css', [], true)
    await streamAsPromise(buildSass())

    expect(logMock.args[1][0]).to.contain('test.css.map')
    expect(logMock.args[1][0]).to.contain('gzipped')
    expect(logMock.args[3][0]).to.contain('test.css')
    expect(logMock.args[3][0]).to.contain('gzipped')
  })

  it('Should not show file size', async () => {
    expect(await fs.pathExists('test/output/css')).to.equal(false)
    const buildSass = tasks['build-sass'](gulp, 'test/input/build-valid/test.scss', 'test/output/css', [], false)
    await streamAsPromise(buildSass())
    expect(logMock).to.not.be.calledWith('\u001b[34mtest.css\u001b[39m \u001b[35m76 B\u001b[39m\u001b[90m (gzipped)\u001b[39m')
  })
}).timeout(0)
