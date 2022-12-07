pipeline {
    agent any
    environment {
        HOME = '.'
    }
    stages {
        stage('Build') {
            agent { docker { image 'node:lts-hydrogen' } }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            when {
                branch main
            }
            steps {
                withCredentials([string(credentialsId: 'tlb-path', variable: 'TLB_PATH'), string(credentialsId: 'tlb-ssh', variable: 'TLB_SSH')]) {
                    sh 'npm run deploy'
                    sshagent(credentials: [TLB_SSH]) {
                        sh "cd $TLB_PATH && git pull && docker compose down && docker compose up -d --build"
                    }
                }
            }
        }
    }
}