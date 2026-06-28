pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Repository checked out successfully.'
            }
        }

        stage('Jenkins Info') {
            steps {
                sh 'pwd'
                sh 'whoami'
                sh 'hostname'
            }
        }

        stage('Docker Info') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

    }

}
