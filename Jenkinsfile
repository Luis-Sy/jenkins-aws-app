pipeline {
	agent any

	environment{
		AWS_DOCKER_REGISTRY = '776940548530.dkr.ecr.us-east-2.amazonaws.com'
		APP_NAME = 'jenkins-react-app'
        AWS_DEFAULT_REGION = 'us-east-2'
    }

    stages {
	
        stage('Build') {
            agent {
				docker {
				image 'node:22.14.0-alpine'
				reuseNode true
            }
        }
			steps {
				sh '''
					ls -la
					node --version
					npm --version
					npm install
					npm run build
					ls -la
				'''
			}
		}
		
		stage('Test'){
			agent {
				docker {
					image 'node:22.14.0-alpine'
					reuseNode true
        	    }
        	}
			steps {
				sh '''
					test -f build/index.html
					npm test
				'''
			}
		}

		stage('Build Docker Image'){
            agent {
                docker {
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
                }
            }
            steps {
				withCredentials([usernamePassword(credentialsId: 'tech2102_group14_final_userkey', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')])
                {  
                    sh '''
						AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
						AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
						AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
						aws sts get-caller-identity
					
						AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
						AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
						AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION
					
                        amazon-linux-extras install docker
                        docker build -t $AWS_DOCKER_REGISTRY/$APP_NAME .
						aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_DOCKER_REGISTRY
						docker push $AWS_DOCKER_REGISTRY/$APP_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to AWS') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root --entrypoint=""'
                }
            }
           
            steps {
                withCredentials([usernamePassword(credentialsId: 'tech2102_group14_final_userkey', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')])
                {  
                    sh '''
                        aws --version
                        yum install jq -y
                       
                        LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json | jq '.taskDefinition.revision')
                        aws ecs update-service --cluster tech2102-group14-final-Cluster-Prod1 --service tech2102-group14-final-Service-Prod1 --task-definition tech2102-group14-final-TaskDefinition-Prod:$LATEST_TD_REVISION
                    '''
                }
            }
        }
	}
}