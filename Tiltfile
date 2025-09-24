# Tiltfile for PsiZero Resonance Platform
# This file orchestrates the local development environment

# Load extensions
load('ext://restart_process', 'docker_build_with_restart')
load('ext://dotenv', 'dotenv')

# Load environment variables
dotenv('.env.local')

# Configure Tilt
update_settings(max_parallel_updates=3)
allow_k8s_contexts('docker-desktop')

# PostgreSQL and Redis from local docker-compose
docker_compose('docker-compose.local.yml')

# Go API Backend
docker_build_with_restart(
    'psizero-api',
    './api',
    dockerfile='./api/Dockerfile.dev',
    entrypoint=['go', 'run', './gateway/main.go'],
    only=[
        'gateway',
        'core',
        'engines',
        'shared',
        'go.mod',
        'go.sum',
    ],
    live_update=[
        sync('./api/gateway', '/app/gateway'),
        sync('./api/core', '/app/core'),
        sync('./api/engines', '/app/engines'),
        sync('./api/shared', '/app/shared'),
    ],
)

# Local k8s deployment for API
k8s_yaml('k8s/local/api-deployment.yaml')

k8s_resource(
    'psizero-api',
    port_forwards=['8080:8080', '9090:9090'],
    labels=['backend'],
    resource_deps=['postgres', 'redis'],
)

# Node SDK Development
local_resource(
    'node-sdk-install',
    cmd='cd node-sdk && npm install',
    deps=['./node-sdk/package.json'],
    labels=['sdk'],
    auto_init=True,
)

local_resource(
    'node-sdk-build',
    serve_cmd='cd node-sdk && npm run dev',
    deps=['./node-sdk/src'],
    labels=['sdk'],
    auto_init=True,
    resource_deps=['node-sdk-install'],
)

# React Frontend
local_resource(
    'react-app',
    serve_cmd='npm run dev',
    deps=['./src', './package.json'],
    labels=['frontend'],
    links=['http://localhost:5173'],
    resource_deps=['psizero-api'],
)

# API Documentation (requires swag to be installed: go install github.com/swaggo/swag/cmd/swag@latest)
local_resource(
    'api-docs-install',
    cmd='go install github.com/swaggo/swag/cmd/swag@latest',
    labels=['docs'],
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
)

local_resource(
    'api-docs',
    cmd='cd api && swag init -g gateway/main.go',
    deps=['./api/gateway', './api/shared/types'],
    labels=['docs'],
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
    resource_deps=['api-docs-install'],
)

# Database Migrations
local_resource(
    'db-migrate',
    cmd='cd api && go run ./scripts/migrate.go up',
    deps=['./api/scripts/migrations'],
    labels=['infrastructure'],
    resource_deps=['postgres'],
    auto_init=False,
)

# Test Runner
local_resource(
    'api-tests',
    cmd='cd api && go test ./...',
    deps=['./api'],
    labels=['testing'],
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
)

# Health Checks
local_resource(
    'health-check',
    cmd='''
    echo "Checking services health..."
    curl -f http://localhost:8080/health || echo "API not healthy"
    curl -f http://localhost:5173 || echo "Frontend not healthy"
    ''',
    labels=['monitoring'],
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
)

# Print helpful information
print("""
🚀 PsiZero Resonance Platform - Local Development Environment

Services will be available at:
- PsiZero App (Frontend & API): http://localhost:8080
- API Docs: http://localhost:8080/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

Tilt UI: http://localhost:10350

Commands:
- Start all: tilt up
- Stop all: tilt down
- Rebuild service: Click rebuild in Tilt UI
- Run tests: Trigger 'api-tests' in Tilt UI
- Check health: Trigger 'health-check' in Tilt UI
""")