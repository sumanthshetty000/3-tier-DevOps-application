pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sumanthshetty000/3-tier-DevOps-application.git'
            }
        }

       stage('Deploy') {
    steps {
        sh '''
        ssh -o StrictHostKeyChecking=no ssm-user@10.0.2.171 '
        cd ~/devops-compose-project &&
        git pull &&
        docker compose up -d --build
        '
        '''
    }
}
    }
}
