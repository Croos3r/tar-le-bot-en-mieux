pipeline {
    agent { docker { image 'node:lts-hydrogen' } }
    environment {
        HOME = '.'
    }
    stages {
        stage('Build') {

            steps {
                sh 'npm install --loglevel=verbose'
                sh 'npm run build'
            }
        }
    }
}