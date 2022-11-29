pipeline {
    agent { docker { image 'node:lts-hydrogen' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm install --loglevel=verbose'
                sh 'npm run build'
            }
        }
    }
}