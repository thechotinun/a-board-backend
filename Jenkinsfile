pipeline {
    agent any

    tools {
        nodejs "node_18_19"
    }

    environment {
        // Database Configuration
        DATABASE_TYPE=credentials('DATABASE_TYPE')
        DATABASE_HOST=credentials('DATABASE_HOST')
        DATABASE_PORT=credentials('DATABASE_PORT')
        DATABASE_NAME=credentials('DATABASE_NAME')
        DATABASE_USER=credentials('DATABASE_USER')
        DATABASE_PASSWORD=credentials('DATABASE_PASSWORD')
        DATABASE_SYNC=credentials('DATABASE_SYNC')
        
        // JWT Configuration
        JWT_ACCESS_SECRET=credentials('JWT_ACCESS_SECRET')
        JWT_ACCESS_EXPIRE=credentials('JWT_ACCESS_EXPIRE')
        JWT_REFRESH_SECRET=credentials('JWT_REFRESH_SECRET')
        JWT_REFRESH_EXPIRE=credentials('JWT_REFRESH_EXPIRE')
        
        // Application Configuration
        PORT=credentials('PORT')
        PER_PAGE=credentials('PER_PAGE')

        // Node environment
        NODE_ENV = 'production'
    }

    stages {
        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        // stage('Lint') {
        //     steps {
        //         sh 'npm run lint'
        //     }
        // }

        // stage('Unit Tests') {
        //     steps {
        //         sh 'npm run test'
        //     }
        //     post {
        //         always {
        //             junit 'test-results/*.xml'
        //         }
        //     }
        // }

        // stage('Integration Tests') {
        //     steps {
        //         sh 'npm run test:e2e'
        //     }
        // }

        // stage('Build') {
        //     steps {
        //         sh 'npm run build'
        //     }
        // }

        stage('Docker Build and Deploy') {
            steps {
                script {
                    // sh 'cat nginx.conf'
                    // Stop and remove existing containers
                    sh 'docker-compose down --rmi all || true'
                    
                    // Build and run new containers
                    sh '''
                        docker-compose build \
                            --build-arg PORT=${PORT} \
                            --build-arg DATABASE_TYPE=${DATABASE_TYPE} \
                            --build-arg DATABASE_HOST=${DATABASE_HOST} \
                            --build-arg DATABASE_PORT=${DATABASE_PORT} \
                            --build-arg DATABASE_NAME=${DATABASE_NAME} \
                            --build-arg DATABASE_USER=${DATABASE_USER} \
                            --build-arg DATABASE_PASSWORD=${DATABASE_PASSWORD} \
                            --build-arg DATABASE_SYNC=${DATABASE_SYNC} \
                            --build-arg JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET} \
                            --build-arg JWT_ACCESS_EXPIRE=${JWT_ACCESS_EXPIRE} \
                            --build-arg JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET} \
                            --build-arg JWT_REFRESH_EXPIRE=${JWT_REFRESH_EXPIRE} \
                            --build-arg PER_PAGE=${PER_PAGE}
                    '''

                    sh '''
                        chmod 644 nginx.conf
                        chown $(id -u):$(id -g) nginx.conf
                    '''

                    sh '''
                        docker-compose up -d
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}