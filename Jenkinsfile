pipeline {
  agent any
  stages {
    stage('Before_Install') {
      steps {
        sh '''curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build
yarn'''
      }
    }

    stage('Coverage') {
      steps {
        sh 'yarn run coverage'
      }
    }

    stage('Test') {
      steps {
        sh '''./cc-test-reporter before-build
yarn test
./cc-test-reporter after-build --exit-code $?'''
      }
    }

  }
}