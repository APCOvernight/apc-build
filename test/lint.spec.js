const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const gulp = require('gulp')

const tasks = require('../')
const streamAsPromise = require('./stream-as-promise')

let logMock

describe('Lint Sass', () => {
  beforeEach(() => {
    gulp.reset()

    logMock = sinon.stub(require('gulp-util'), 'log')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Run lint-sass on valid sass files', async () => {
    const lintSass = tasks['lint-sass'](gulp, 'test/input/lint-valid/*.scss')
    const res = await lintSass()
    expect(res).to.equal(0)
    expect(logMock).to.be.calledWith('No Sass Lint Errors')
  })

  it('Run lint-sass on invalid sass files', async () => {
    const lintSass = tasks['lint-sass'](gulp, 'test/input/lint-invalid/*.scss')
    try {
      await lintSass()
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Sass Lint Errors')
    }
    expect(logMock).to.be.calledWith('test/input/lint-invalid/test.scss')
    expect(logMock).to.be.calledWith('  2:14  warning  Trailing semicolons required  trailing-semicolon')
    expect(logMock).to.be.calledWith('✖ 1 problem (0 errors, 1 warning)')
  })
})

describe('Lint Pug', () => {
  beforeEach(() => {
    gulp.reset()
    logMock = sinon.stub(require('gulp-util'), 'log')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Run lint-pug on valid pug files', async () => {
    const lintPug = tasks['lint-pug'](gulp, 'test/input/lint-valid/*.pug')
    await streamAsPromise(lintPug())
    expect(logMock).to.be.calledWith('No Pug Lint Errors')
  })

  it('Run lint-pug on invalid pug files', async () => {
    const lintPug = tasks['lint-pug'](gulp, 'test/input/lint-invalid/*.pug')
    await streamAsPromise(lintPug())
      .then(() => {
        expect(0).to.equal(1)
      })
      .catch((e) => {
        expect(e.message).to.equal('Pug Lint Errors')
        expect(logMock).to.be.calledWith('Invalid indentation')
      })
  })
})

describe('Lint JS', () => {
  beforeEach(() => {
    gulp.reset()
    logMock = sinon.stub(require('gulp-util'), 'log')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Run lint-js on valid js files', async () => {
    const lintPug = tasks['lint-js'](gulp, 'test/input/lint-valid/*.js')
    await streamAsPromise(lintPug())
    expect(logMock).to.be.calledWith('No JS Lint Errors')
  })

  it('Run lint-js on invalid js files', async () => {
    const lintPug = tasks['lint-js'](gulp, 'test/input/lint-invalid/*.js')
    await streamAsPromise(lintPug())
      .then(() => {
        expect(0).to.equal(1)
      })
      .catch((e) => {
        expect(e.message).to.equal('JS Lint Errors')
        expect(logMock.firstCall.args[0]).to.contain('✖ 2 problems (2 errors, 0 warnings)')
      })
  })
})
