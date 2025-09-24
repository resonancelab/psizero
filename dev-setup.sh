#!/bin/bash

# Development Setup Script for PsiZero
# This script helps set up the development environment

set -e

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

# Check if backend is running
check_backend() {
    log_info "Checking if backend API is running on localhost:8080..."

    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        log_success "Backend API is running and healthy"
        return 0
    else
        log_warning "Backend API is not running on localhost:8080"
        log_info "Make sure your backend server is running on port 8080"
        log_info "If you don't have a backend yet, you can:"
        log_info "  1. Start developing the backend API"
        log_info "  2. Or set REACT_APP_USE_MOCK_API=true in .env.local for fallback mode"
        return 1
    fi
}

# Start frontend development server
start_frontend() {
    log_info "Starting frontend development server..."

    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm install
    fi

    log_info "Starting development server on http://localhost:5173"
    npm run dev
}

# Main setup function
main() {
    echo "🚀 PsiZero Development Setup"
    echo "============================"

    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f ".env.local" ]; then
        log_error "Please run this script from the PsiZero frontend project root directory"
        exit 1
    fi

    # Check backend status
    if check_backend; then
        log_success "Environment is ready for development!"
    else
        log_warning "Backend not detected, but you can still start the frontend"
        log_info "The frontend will show connection errors but will work with fallback predictions"
    fi

    echo ""
    log_info "Frontend Configuration:"
    echo "  - API URL: $(grep REACT_APP_API_BASE_URL .env.local | cut -d'=' -f2)"
    echo "  - Environment: $(grep REACT_APP_ENVIRONMENT .env.local | cut -d'=' -f2)"
    echo "  - Mock Fallback: $(grep REACT_APP_USE_MOCK_API .env.local | cut -d'=' -f2)"

    echo ""
    log_info "Starting development environment..."

    # Start frontend
    start_frontend
}

# Handle command line arguments
case "${1:-}" in
    "check-backend")
        check_backend
        ;;
    "frontend")
        start_frontend
        ;;
    *)
        main
        ;;
esac