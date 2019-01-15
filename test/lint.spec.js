const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const gulp = require('gulp')

gulp.reset = () => {
  gulp._registry._tasks = {}
}

const tasks = require('../')
const streamAsPromise = require('./stream-as-promise')

let logMock

describe('Lint Sass', () => {
  beforeEach(() => {
    gulp.reset()

    logMock = sinon.spy(process.stdout, 'write')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Run lint-sass on valid sass files', async () => {
    const lintSass = tasks['lint-sass'](gulp, 'test/input/lint-valid/*.scss')
    const res = await lintSass()
    expect(res).to.equal(0)
    expect(logMock.getCall(1).args[0]).to.equal('No Sass Lint Errors\n')
  })

  // eslint-disable-next-line mocha/no-exclusive-tests
  it('Run lint-sass on invalid sass files', async () => {
    const lintSass = tasks['lint-sass'](gulp, 'test/input/lint-invalid/*.scss')
    try {
      await lintSass()
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Sass Lint Errors')
    }
    expect(logMock.getCall(3).args[0]).to.be.equal('test/input/lint-invalid/test.scss\n')
    expect(logMock.getCall(5).args[0]).to.be.equal('  2:14  warning  Trailing semicolons required  trailing-semicolon\n')
    expect(logMock.getCall(9).args[0]).to.be.equal('✖ 1 problem (0 errors, 1 warning)\n')
  })
}).timeout(0)

describe('Lint Pug', () => {
  beforeEach(() => {
    gulp.reset()
    logMock = sinon.spy(process.stdout, 'write')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Run lint-pug on valid pug files', async () => {
    const lintPug = tasks['lint-pug'](gulp, 'test/input/lint-valid/*.pug')
    await streamAsPromise(lintPug())
    expect(logMock.getCall(1).args[0]).to.equal('No Pug Lint Errors\n')
  })

  it('Run lint-pug on invalid pug files', async () => {
    const lintPug = tasks['lint-pug'](gulp, 'test/input/lint-invalid/*.pug')
    await streamAsPromise(lintPug())
      .then(() => {
        expect(0).to.equal(1)
      })
      .catch((e) => {
        expect(e.message).to.equal('Pug Lint Errors')
        expect(logMock.getCall(13).args[0]).to.equal('Invalid indentation\n')
      })
  })
}).timeout(0)

describe('Lint JS', () => {
  beforeEach(() => {
    gulp.reset()
    logMock = sinon.spy(process.stdout, 'write')
  })

  afterEach(() => {
    logMock.restore()
  })

  it('Run lint-js on valid js files', async () => {
    const lintPug = tasks['lint-js'](gulp, 'test/input/lint-valid/*.js')
    await streamAsPromise(lintPug())
    expect(logMock.getCall(1).args[0]).to.equal('No JS Lint Errors\n')
  })

  it('Run lint-js on invalid js files', async () => {
    const lintPug = tasks['lint-js'](gulp, 'test/input/lint-invalid/*.js')
    await streamAsPromise(lintPug())
      .then(() => {
        expect(0).to.equal(1)
      })
      .catch((e) => {
        expect(e.message).to.equal('JS Lint Errors')
        expect(logMock.getCall(1).args[0]).to.have.string('✖ 2 problems (2 errors, 0 warnings)')
      })
  })
}).timeout(0)
