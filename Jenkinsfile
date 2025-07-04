def currentBranch = ''
def config = [:] // Map untuk simpan semua config.environment dari config file

pipeline {
    agent any

    environment {
        APP_NAME = 'be-dns-multi-tenant'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Detect Branch Name') {
            steps {
                script {
                    def rawBranch = sh(
                        script: "git name-rev --name-only HEAD",
                        returnStdout: true
                    ).trim()
                
                    // Remove prefix like "remotes/origin/"
                    currentBranch = rawBranch.replaceFirst(/^.*origin\//, '')
                    echo "Current branch: ${rawBranch} -> ${currentBranch}"
                }
            }
        }

        stage('Determine environment') {
            steps {
                script {
                    configFileProvider([configFile(fileId: 'be-dns-env', variable: 'CONFIG_FILE')]) {
                        def props = readProperties file: "${env.CONFIG_FILE}"

                        // Simpan ke map config
                        if (currentBranch == 'release') {
                            config.environment = props['ENVIRONMENT_PROD']
                            config.sshHost = props['SSH_HOST_PROD']
                            config.sshUser = props['SSH_USER_PROD']
                            config.remoteAppDir = props['REMOTE_APP_DIR_PROD']
                        } else if (currentBranch == 'devel') {
                            config.environment = props['ENVIRONMENT_DEV']
                            config.sshHost = props['SSH_HOST_DEV']
                            config.sshUser = props['SSH_USER_DEV']
                            config.remoteAppDir = props['REMOTE_APP_DIR_DEV']
                        } else {
                            error "No deployment configured for branch: ${currentBranch}"
                        }

                        echo "Deployment ENV: ${config.environment}"
                        echo "Remote Host: ${config.sshHost}, User: ${config.sshUser}"
                    }
                }
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                sshagent(credentials: ['ssh-key-jenkins-dns-test']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${config.sshUser}@${config.sshHost} '
                        mkdir -p ${config.remoteAppDir}
                    '
                    rsync -avz --delete --exclude '.env' --exclude 'node_modules' -e "ssh -o StrictHostKeyChecking=no" ./ ${config.sshUser}@${config.sshHost}:${config.remoteAppDir}
                    ssh ${config.sshUser}@${config.sshHost} '
                        export NVM_DIR="\$HOME/.nvm"
                        [ -s "\$NVM_DIR/nvm.sh" ] && \\. "\$NVM_DIR/nvm.sh"
                        [ -s "\$NVM_DIR/bash_completion" ] && \\. "\$NVM_DIR/bash_completion"
                        nvm use default
                        cd ${config.remoteAppDir} &&
                        npm install &&
                        pm2 restart ${APP_NAME}-${config.environment} || pm2 start src/server.js --name ${APP_NAME}-${config.environment}
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployed to ${config.environment} (${currentBranch})"
        }
        failure {
            echo "Deployment failed for ${currentBranch}"
        }
    }
}
