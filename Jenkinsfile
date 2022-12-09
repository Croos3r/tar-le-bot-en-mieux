pipeline {
    agent any
    stages {
        stage('Build') {
            environment {
                HOME = '.'
            }
            agent { docker { image 'node:lts-hydrogen' } }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            environment {
                DATABASE_FILE = './database.sqlite3'
                BIRTHDAY_CHANNEL_ID = '902949941989752892'
                BOT_TOKEN = credentials('tlb-token')
            }
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'tlb-ssh', variable: 'TLB_SSH'), string(credentialsId: 'tlb-path', variable: 'TLB_PATH')]) {
                    sshagent(credentials: [TLB_SSH]) {
                        sh 'printenv > .env'
                        sh 'cd $TLB_PATH && git pull && docker compose down && docker compose up -d --build'
                    }
                }
            }
        }
    }
}