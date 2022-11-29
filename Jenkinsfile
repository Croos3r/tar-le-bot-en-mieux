pipeline {
    agent any
    stages {
        stage('Build') {
            agent { docker { image 'node:lts-hydrogen' } }
            steps {
                sh 'npm install --loglevel=verbose'
                sh 'npm run build'
            }
        }
    }
}