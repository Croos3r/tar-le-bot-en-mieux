pipeline {
    agent { docker { image 'node:lts-hydrogen' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}