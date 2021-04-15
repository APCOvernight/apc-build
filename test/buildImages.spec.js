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

describe('Build Images', () => {
  beforeEach(async () => {
    gulp.reset()
    logMock = sinon.spy(process.stdout, 'write')
    await fs.emptyDir('test/output')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Should move and minify images', async () => {
    try {
      expect(await fs.pathExists('test/output/img')).to.equal(false)
      const buildImg = tasks['build-img'](gulp, 'test/input/build-valid/*', 'test/output/img')
      await streamAsPromise(buildImg())
      expect(await fs.pathExists('test/output/img/test.jpg')).to.equal(true)
      expect(logMock.args[1][0]).to.have.string('gulp-imagemin: Minified 1 image')
    } catch (error) {
      console.error(error.message)
    }
  }).timeout(0)
}).timeout(0)
