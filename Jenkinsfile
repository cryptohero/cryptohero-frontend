node {
  def GCP_PROJECT
  def GCP_CLUSTER
  def GCP_ZONE
  def GCP_SERVICE_ACCOUNT_CREDENTIALID = 'GCPServiceAccount'
  def APP_NAME
  def IMAGE_TAG
  def NAMESPACE
  def cfg

  stage('Init parameters') {
    configFileProvider(
      [configFile(fileId: 'CI_CONFIG', variable: 'CI_CONFIG_FILE')]) {
        cfg = readJSON file: "$CI_CONFIG_FILE"
    }

    GCP_PROJECT = cfg.gcp.project
    GCP_CLUSTER = cfg.gcp.cluster
    GCP_ZONE = cfg.gcp.zone
    APP_NAME = cfg.appName
    IMAGE_TAG = "gcr.io/${GCP_PROJECT}/${APP_NAME}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
  }

  stage('Clone repository') {
    checkout scm
  }

  stage('NPM run build') {
    docker.image('node:carbon').inside {
        sh 'npm install'
        sh 'npm run build'
    }
  }

  if (env.BRANCH_NAME == cfg.production.branch) {
    NAMESPACE = cfg.production.namespace
  } else if (env.BRANCH_NAME == cfg.testing.branch) {
    NAMESPACE = cfg.testing.namespace
  } else {
    echo "Skip deployment on branch: ${env.BRANCH_NAME}"
    echo "Deployment only works on ${cfg.production.branch}/${cfg.testing.branch} branches"
    sh 'exit 0'
  }

  stage('Build image') {
    docker.build("${IMAGE_TAG}")
  }

  stage('Sign in GCP') {
    withCredentials([file(credentialsId: "${GCP_SERVICE_ACCOUNT_CREDENTIALID}", variable: 'KEY_FILE')]) {
        docker.image('google/cloud-sdk:latest').inside {
            sh "gcloud auth activate-service-account --key-file=$KEY_FILE"
            sh "gcloud container clusters get-credentials ${GCP_CLUSTER} --zone ${GCP_ZONE} --project ${GCP_PROJECT}"

            stage('Push image') {
              sh "gcloud docker -- push ${IMAGE_TAG}"
            }

            stage('Deploy') {
              sh "sed -i.bak 's#APP_NAME#${APP_NAME}#' ./k8s/deployment.yaml"
              sh "sed -i.bak 's#IMAGE_TAG#${IMAGE_TAG}#' ./k8s/deployment.yaml"
              sh "sed -i.bak 's#NAMESPACE#${NAMESPACE}#' ./k8s/deployment.yaml"

              sh 'cat ./k8s/deployment.yaml'

              // Create namespace if it doesn't exist
              sh "kubectl get ns ${NAMESPACE} || kubectl create ns ${NAMESPACE}"
              sh "kubectl apply -f ./k8s/deployment.yaml"
            }
        }
    }
  }
}
