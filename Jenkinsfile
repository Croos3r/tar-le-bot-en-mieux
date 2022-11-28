pipeline {
    agent { docker { image 'node:lts-alpine' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}