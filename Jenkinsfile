pipeline {
    agent { docker { image 'node:lts-hydrogen' } }
    stages {
        stage('Build') {
            steps {
                sh 'chown -R 108:114 "/.npm"'
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}