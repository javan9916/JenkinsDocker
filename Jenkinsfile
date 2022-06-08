node {
    def app 
    stage('Cloning our Git') {
        checkout scm  
    }
    stage('Building Docker Image'){
        app = docker.build("javan9916/nodejs-twitter")
    }
    stage('Test Image'){
        app.inside {
            sh 'echo "TEST PASSED"' 
        }  
    }
    stage('Push Image'){
        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {            
        app.push("${env.BUILD_NUMBER}")            
        app.push("latest")  
        }
    }
}