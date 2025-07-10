#!/bin/bash

# Ask the user for deployment type
echo "Select deployment type: [local/k8s]"
read -r DEPLOY_TYPE

if [ "$DEPLOY_TYPE" == "local" ]; then
  # For local deployment, just set up the correct environment
  echo "Select environment for local deployment: [prod/dev]"
  read -r ENV

  if [ "$ENV" == "prod" ]; then
    cp .env.config.prod .env
  elif [ "$ENV" == "dev" ]; then
    cp .env.config.dev .env
  else
    echo "Error: specify prod or dev"
    exit 1
  fi

  # Load environment variables
  if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
  else
    echo "Error: .env file not found."
    exit 1
  fi

  echo "Local environment setup completed successfully."
  echo "Starting local development server..."
  npm run dev
  exit 0

elif [ "$DEPLOY_TYPE" == "k8s" ]; then
  # For Kubernetes deployment
  echo "Select environment: [prod/dev]"
  read -r ENV

  if [ "$ENV" == "prod" ]; then
    cp .env.config.prod .env
  elif [ "$ENV" == "dev" ]; then
    cp .env.config.dev .env
  else
    echo "Error: specify prod or dev"
    exit 1
  fi

  # Load environment variables
  if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
  else
    echo "Error: .env file not found."
    exit 1
  fi

  if [[ "$ENV" == "prod" ]]; then
    KUBECONFIG=$KUBECONFIG_PROD
    DOCKER_IMAGE_TAG=$DOCKER_IMAGE_TAG_PROD
    DEPLOYMENT_FILE="kubernetes/deployment-production.yaml"
    INGRESS_FILE="kubernetes/ingress-production.yaml"

    # Validate URLs for production
    if [[ "$VITE_BACKEND_URL" == *"dev"* ]] || [[ "$VITE_KEYCLOAK_URL" == *"dev"* ]]; then
      echo "Error: Backend or Keycloak URL contains 'dev' but 'prod' environment was selected."
      exit 1
    fi

  elif [[ "$ENV" == "dev" ]]; then
    KUBECONFIG=$KUBECONFIG_DEV
    DOCKER_IMAGE_TAG=$DOCKER_IMAGE_TAG_DEV
    DEPLOYMENT_FILE="kubernetes/deployment-development.yaml"
    INGRESS_FILE="kubernetes/ingress-development.yaml"

    # Validate URLs for development
    if [[ "$VITE_BACKEND_URL" != *"dev"* ]] || [[ "$VITE_KEYCLOAK_URL" != *"dev"* ]]; then
      echo "Error: Backend or Keycloak URL does not contain 'dev' but 'dev' environment was selected."
      exit 1
    fi

  else
    echo "Error: Invalid environment. Use 'prod' or 'dev'."
    exit 1
  fi

  # Docker login
  echo "Logging into Docker registry..."
  echo "$IONOS_TOKEN_PASSWORD" | docker login "$IONOS_DOCKER_REGISTRY" -u "$IONOS_TOKEN_NAME" --password-stdin
  if [ $? -ne 0 ]; then
    echo "Error: Docker login failed."
    exit 1
  fi

  # Build and push Docker image
  echo "Building and pushing Docker image..."
  docker build -t "$IONOS_DOCKER_REGISTRY/$DOCKER_IMAGE_TAG" .
  docker push "$IONOS_DOCKER_REGISTRY/$DOCKER_IMAGE_TAG"

  # Set Kubernetes configuration
  echo "Setting up Kubernetes configuration..."
  export KUBECONFIG=$KUBECONFIG

  # Apply deployment and service configurations
  echo "Applying Kubernetes configurations..."
  kubectl apply -f "$DEPLOYMENT_FILE"
  kubectl rollout restart deployment "$(basename "$DOCKER_IMAGE_TAG" | cut -d':' -f1)"
  kubectl apply -f kubernetes/service.yaml
  kubectl apply -f "$INGRESS_FILE"

  echo "Deployment completed successfully for $ENV environment."
  exit 0

else
  echo "Error: Invalid deployment type. Use 'local' or 'k8s'."
  exit 1
fi

