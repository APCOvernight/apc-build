
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const gulp = require('gulp')

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
    const lintSass = require('../gulp-tasks/lint-sass')(gulp, 'test/input/lint-valid/*.scss')
    const res = await lintSass()
    expect(res).to.equal(0)
    expect(logMock).to.be.calledWith('No Sass Lint Errors')
  })

  it('Run lint-sass on invalid sass files', async () => {
    const lintSass = require('../gulp-tasks/lint-sass')(gulp, 'test/input/lint-invalid/*.scss')
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
    const lintPug = require('../gulp-tasks/lint-pug')(gulp, 'test/input/lint-valid/*.pug')
    await lintPug()
    expect(logMock).to.be.calledWith('No Pug Lint Errors')
  })

  it('Run lint-pug on invalid pug files', async () => {
    const lintPug = require('../gulp-tasks/lint-pug')(gulp, 'test/input/lint-invalid/*.pug')
    await lintPug()
      .then(() => {
        expect(0).to.equal(1)
      })
      .catch((e) => {
        expect(e.message).to.equal('Pug Lint Errors')
        expect(logMock).to.be.calledWith('Invalid indentation')
      })
  })
})
