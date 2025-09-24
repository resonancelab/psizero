#!/bin/bash

# PsiZero Deployment Script for Google Cloud Platform
# This script handles the complete deployment process

set -e

# Configuration
PROJECT_ID=${PROJECT_ID:-"psizero-platform"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="psizero-frontend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi

    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi

    # Check if authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 > /dev/null; then
        log_error "Not authenticated with Google Cloud. Please run 'gcloud auth login'"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Set up Google Cloud Project
setup_project() {
    log_info "Setting up Google Cloud Project..."

    # Set project
    gcloud config set project ${PROJECT_ID}

    # Enable required APIs
    log_info "Enabling required APIs..."
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    gcloud services enable dns.googleapis.com
    gcloud services enable certificatemanager.googleapis.com

    log_success "Project setup completed"
}

# Build and push Docker image
build_and_push() {
    log_info "Building and pushing Docker image..."

    # Build Docker image
    docker build -t ${IMAGE_NAME}:latest .

    # Configure Docker to use gcloud as a credential helper
    gcloud auth configure-docker --quiet

    # Push to Google Container Registry
    docker push ${IMAGE_NAME}:latest

    log_success "Docker image built and pushed"
}

# Deploy to Cloud Run
deploy_to_cloud_run() {
    log_info "Deploying to Cloud Run..."

    # Deploy to Cloud Run
    gcloud run deploy ${SERVICE_NAME} \
        --image ${IMAGE_NAME}:latest \
        --platform managed \
        --region ${REGION} \
        --allow-unauthenticated \
        --port 80 \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --concurrency 80 \
        --timeout 300 \
        --set-env-vars "NODE_ENV=production,INITIAL_SETUP_TOKEN=$(openssl rand -hex 32)"

    # Get the service URL
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

    log_success "Deployment completed. Service URL: ${SERVICE_URL}"
    echo ${SERVICE_URL} > .service_url
}

# Set up DNS
setup_dns() {
    log_info "Setting up DNS for psizero.com..."

    # Create managed zone if it doesn't exist
    if ! gcloud dns managed-zones describe psizero-zone &> /dev/null; then
        log_info "Creating DNS managed zone..."
        gcloud dns managed-zones create psizero-zone \
            --dns-name="psizero.com." \
            --description="DNS zone for psizero.com"
    fi

    # Get Cloud Run service IP (for CNAME setup)
    SERVICE_URL=$(cat .service_url 2>/dev/null || gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

    # Extract the domain from Cloud Run URL
    CLOUD_RUN_DOMAIN=$(echo ${SERVICE_URL} | sed 's|https://||' | sed 's|/.*||')

    log_info "Cloud Run domain: ${CLOUD_RUN_DOMAIN}"

    # Create DNS records
    log_info "Creating DNS records..."

    # A record for root domain (if using load balancer)
    # gcloud dns record-sets create psizero.com. \
    #     --zone=psizero-zone \
    #     --type=A \
    #     --ttl=300 \
    #     --rrdatas="YOUR_LOAD_BALANCER_IP"

    # CNAME record for www subdomain
    gcloud dns record-sets create www.psizero.com. \
        --zone=psizero-zone \
        --type=CNAME \
        --ttl=300 \
        --rrdatas="${CLOUD_RUN_DOMAIN}."

    log_success "DNS records created. Please update your domain registrar with the nameservers shown above."
}

# Set up SSL certificate
setup_ssl() {
    log_info "Setting up SSL certificate..."

    # Create SSL certificate
    gcloud certificate-manager certificates create psizero-cert \
        --domains="psizero.com,www.psizero.com"

    # Create certificate map
    gcloud certificate-manager maps create psizero-cert-map

    # Create certificate map entry
    gcloud certificate-manager maps entries create psizero-cert-entry \
        --map="psizero-cert-map" \
        --certificates="psizero-cert" \
        --hostname="psizero.com,www.psizero.com"

    log_success "SSL certificate setup initiated. It may take a few minutes to provision."
}

# Main deployment function
main() {
    echo "🚀 PsiZero Deployment to Google Cloud Platform"
    echo "=============================================="

    check_prerequisites
    setup_project
    build_and_push
    deploy_to_cloud_run
    setup_dns
    setup_ssl

    SERVICE_URL=$(cat .service_url 2>/dev/null)
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "====================================="
    echo "Service URL: ${SERVICE_URL}"
    echo ""
    echo "Next steps:"
    echo "1. Update your domain registrar with the Cloud DNS nameservers"
    echo "2. Wait for DNS propagation (may take up to 24 hours)"
    echo "3. SSL certificate will be provisioned automatically"
    echo "4. Test your application at https://psizero.com"
    echo ""
    echo "To check deployment status:"
    echo "gcloud run services describe ${SERVICE_NAME} --region=${REGION}"
    echo ""
    echo "To view logs:"
    echo "gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
}

# Handle command line arguments
case "${1:-}" in
    "build")
        check_prerequisites
        build_and_push
        ;;
    "deploy")
        check_prerequisites
        setup_project
        deploy_to_cloud_run
        ;;
    "dns")
        setup_dns
        ;;
    "ssl")
        setup_ssl
        ;;
    *)
        main
        ;;
esac