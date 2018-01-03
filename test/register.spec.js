const register = require('../').register
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const gulp = require('gulp')

gulp.reset = () => {
  gulp._registry._tasks = {}
}

describe('Register gulp tasks', () => {
  beforeEach(() => {
    gulp.reset()
  })

  it('Throw if no gulp instance passed', () => {
    try {
      register(null, {})
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Gulp instance not passed')
    }
  })

  it('Throw if invalid gulp instance passed', () => {
    try {
      register({}, {})
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Gulp instance not passed')
    }
  })

  it('Throw if no config passed', () => {
    try {
      register(gulp)
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Config object not passed')
    }
  })

  it('Throw if invalid config passed', () => {
    try {
      register(gulp, 'config')
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Config object not passed')
    }
  })

  it('Empty config does not register any tasks', () => {
    register(gulp, {})
    expect(Object.keys(gulp._registry._tasks).length).to.equal(0)
  })

  it('Register lint-sass task', () => {
    register(gulp, {
      scssSrc: 'test/input/**/*.scss'
    })
    expect(Object.keys(gulp._registry._tasks).length).to.equal(1)
    expect(gulp._registry._tasks['lint-sass']).to.be.a('function')
  })

  it('Register build-sass task', () => {
    register(gulp, {
      scssSrc: 'test/input/**/*.scss',
      cssDest: 'test/output/css'
    })
    expect(Object.keys(gulp._registry._tasks).length).to.equal(2)
    expect(gulp._registry._tasks['build-sass']).to.be.a('function')
  })

  it('Register lint-pug task', () => {
    register(gulp, {
      pugSrc: 'test/input/**/*.pug'
    })
    expect(Object.keys(gulp._registry._tasks).length).to.equal(1)
    expect(gulp._registry._tasks['lint-pug']).to.be.a('function')
  })

  it('Register lint-js task', () => {
    register(gulp, {
      jsSrc: 'test/input/**/*.spec.js'
    })
    expect(Object.keys(gulp._registry._tasks).length).to.equal(1)
    expect(gulp._registry._tasks['lint-js']).to.be.a('function')
  })

  it('Register build-js task', () => {
    register(gulp, {
      jsEntry: 'test/input/**/*.spec.js',
      jsDest: 'test/output/js'
    })
    expect(Object.keys(gulp._registry._tasks).length).to.equal(1)
    expect(gulp._registry._tasks['build-js']).to.be.a('function')
  })

  it('Register build-img task', () => {
    register(gulp, {
      imgSrc: 'test/input/**/*',
      imgDest: 'test/output/img'
    })
    expect(Object.keys(gulp._registry._tasks).length).to.equal(1)
    expect(gulp._registry._tasks['build-img']).to.be.a('function')
  })
})

describe('Register gulp watchers', () => {
  beforeEach(() => {
    gulp.reset()
  })

  it('Register returns a function', () => {
    const registerWatchers = register(gulp, {}).registerWatchers
    expect(registerWatchers).to.be.a('function')
  })

  it('Throw if no gulp instance passed', () => {
    const registerWatchers = register(gulp, {}).registerWatchers
    try {
      registerWatchers()
      expect(0).to.equal(1)
    } catch (e) {
      expect(e.message).to.equal('Gulp instance not passed')
    }
  })

  it('Registers watcher for lint-sass', () => {
    const registerWatchers = register(gulp, {
      scssSrc: 'test/input/**/*.scss'
    }).registerWatchers
    expect(registerWatchers).to.be.a('function')

    const watchStub = sinon.stub(gulp, 'watch').returns(true)

    registerWatchers(gulp)

    expect(watchStub).to.be.calledWith('test/input/**/*.scss', ['lint-sass'])

    watchStub.restore()
  })

  it('Registers watchers for lint-sass and build-sass', () => {
    const registerWatchers = register(gulp, {
      scssSrc: 'test/input/**/*.scss',
      cssDest: 'test/output/css'
    }).registerWatchers
    expect(registerWatchers).to.be.a('function')

    const watchStub = sinon.stub(gulp, 'watch').returns(true)

    registerWatchers(gulp)

    expect(watchStub).to.be.calledWith('test/input/**/*.scss', ['lint-sass'])
    expect(watchStub).to.be.calledWith('test/input/**/*.scss', ['build-sass'])

    watchStub.restore()
  })
})
