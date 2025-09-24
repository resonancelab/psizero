# Production Deployment Guide - Google Cloud Platform

This guide covers deploying the PsiZero Resonance Platform to Google Cloud Platform (GCP) with a production-ready architecture.

## Architecture Overview

```mermaid
graph TB
    subgraph "Google Cloud Platform"
        subgraph "Global Edge"
            CDN[Cloud CDN]
            LB[Global Load Balancer<br/>SSL Termination]
        end
        
        subgraph "GKE Cluster (us-central1)"
            subgraph "Frontend Services"
                ReactPods[React App Pods<br/>3 replicas]
            end
            
            subgraph "Backend Services"
                APIPods[Go API Pods<br/>5 replicas]
                Gateway[API Gateway<br/>Cloud Endpoints]
            end
            
            subgraph "Ingress"
                Ingress[Ingress Controller<br/>NGINX]
            end
        end
        
        subgraph "Managed Services"
            SQL[Cloud SQL<br/>PostgreSQL HA]
            Redis[Memorystore<br/>Redis]
            Storage[Cloud Storage<br/>Static Assets]
        end
        
        subgraph "DevOps & Monitoring"
            Build[Cloud Build<br/>CI/CD]
            Registry[Artifact Registry]
            Monitor[Cloud Monitoring]
            Logging[Cloud Logging]
            Trace[Cloud Trace]
        end
    end
    
    Users --> CDN
    CDN --> LB
    LB --> Ingress
    Ingress --> ReactPods
    Ingress --> Gateway
    Gateway --> APIPods
    APIPods --> SQL
    APIPods --> Redis
    ReactPods --> Storage
    Build --> Registry
    Registry --> GKE
```

## Prerequisites

1. **GCP Account & Project**
   ```bash
   # Set up gcloud CLI
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Required APIs**
   ```bash
   gcloud services enable \
     container.googleapis.com \
     cloudbuild.googleapis.com \
     artifactregistry.googleapis.com \
     sqladmin.googleapis.com \
     redis.googleapis.com \
     monitoring.googleapis.com \
     logging.googleapis.com
   ```

3. **Tools**
   - `gcloud` CLI
   - `kubectl`
   - `helm`
   - `terraform` (optional)

## Step 1: Infrastructure Setup

### 1.1 Create GKE Cluster

```bash
# Create GKE cluster with autoscaling
gcloud container clusters create psizero-prod \
  --region us-central1 \
  --num-nodes 3 \
  --min-nodes 3 \
  --max-nodes 10 \
  --enable-autoscaling \
  --machine-type n2-standard-4 \
  --disk-size 100 \
  --enable-cloud-logging \
  --enable-cloud-monitoring \
  --enable-ip-alias \
  --network "default" \
  --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver

# Get credentials
gcloud container clusters get-credentials psizero-prod --region us-central1
```

### 1.2 Set up Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create psizero-db \
  --database-version=POSTGRES_15 \
  --tier=db-n1-standard-4 \
  --region=us-central1 \
  --network=default \
  --backup \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04 \
  --high-availability

# Create database and user
gcloud sql databases create psizero_resonance --instance=psizero-db
gcloud sql users create psizero --instance=psizero-db --password=SECURE_PASSWORD
```

### 1.3 Set up Memorystore Redis

```bash
# Create Redis instance
gcloud redis instances create psizero-cache \
  --size=5 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=standard
```

### 1.4 Create Artifact Registry

```bash
# Create Docker repository
gcloud artifacts repositories create psizero-images \
  --repository-format=docker \
  --location=us-central1 \
  --description="PsiZero container images"

# Configure Docker auth
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Step 2: Build & Deploy Configuration

### 2.1 Cloud Build Configuration

<write_to_file>
<path>cloudbuild.yaml</path>
<content>
# Cloud Build configuration for CI/CD
steps:
  # Build Go API
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/api:$COMMIT_SHA'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/api:latest'
      - '-f'
      - 'api/Dockerfile'
      - './api'
    id: 'build-api'

  # Build React App
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['ci']
    id: 'install-frontend'

  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'build']
    env:
      - 'VITE_API_BASE_URL=https://api.psizero.ai/v1'
      - 'VITE_SUPABASE_URL=${_SUPABASE_URL}'
      - 'VITE_SUPABASE_PUBLISHABLE_KEY=${_SUPABASE_KEY}'
    id: 'build-frontend'

  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/frontend:$COMMIT_SHA'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/frontend:latest'
      - '-f'
      - 'Dockerfile.frontend'
      - '.'
    id: 'build-frontend-image'

  # Push images
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '--all-tags', 'us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/api']
    id: 'push-api'

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '--all-tags', 'us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/frontend']
    id: 'push-frontend'

  # Deploy to GKE
  - name: 'gcr.io/cloud-builders/gke-deploy'
    args:
      - 'run'
      - '--filename=k8s/production/'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/api:$COMMIT_SHA'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/psizero-images/frontend:$COMMIT_SHA'
      - '--cluster=psizero-prod'
      - '--location=us-central1'
    id: 'deploy'

substitutions:
  _SUPABASE_URL: 'https://your-project.supabase.co'
  _SUPABASE_KEY: 'your-supabase-anon-key'

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_8'

timeout: '1200s'