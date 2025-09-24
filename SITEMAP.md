# Symbolic AI Engine Sitemap

## Overview
The Symbolic AI Engine is a web platform providing access to revolutionary quantum computing APIs that solve NP-complete problems through Ψ0=1 formalism. The application features a comprehensive suite of APIs, interactive demos, documentation, and user management tools.

## Application Structure

### Main Navigation
- **Home** (`/`) - Landing page with platform overview
- **APIs** (`/apis`) - API overview and individual API pages
  - All APIs (`/apis`)
  - SRS - Symbolic Resonance Solver (`/apis/srs`)
  - HQE - Holographic Quantum Encoder (`/apis/hqe`)
  - QSEM - Quantum Semantics (`/apis/qsem`)
  - NLC - Non-Local Communication (`/apis/nlc`)
  - QCR - Quantum Consciousness Resonator (`/apis/qcr`)
  - I-Ching - Oracle Evolution (`/apis/iching`)
  - Unified - Physics Modeling (`/apis/unified`)
  - RNET - Resonance Network (`/apis/rnet`)
  - SAI - Symbolic AI Engine (`/apis/sai`)
- **Documentation** (`/docs`) - API documentation and guides
- **Demos** (`/demos`) - Interactive demonstrations
  - Quantum Stock Market Oracle (`/demos/quantum-stock-oracle`)
  - Impossible Optimizer (`/demos/impossible-optimizer`)
  - Quaternionic Communication (`/demos/quaternionic-communication`)
- **Blog** (`/blog`) - News and updates
  - Individual blog posts (`/blog/:slug`)
- **Tutorials** (`/tutorials`) - Learning resources
  - Individual tutorials (`/tutorials/:slug`)
- **Patents** (`/patents`) - Patent information
- **Playground** (`/playground`) - Interactive API testing
- **SDKs** (`/sdks`) - Software development kits

### User Account (Authenticated)
- **Dashboard** (`/dashboard`) - User dashboard
- **Account Settings** (`/account`) - Profile management
- **Organizations** (`/organizations`) - Organization management
- **Team Management** (`/team`) - Team member management
- **Security** (`/security`) - Security settings
- **Billing** (`/billing`) - Billing and payment history
- **Plans** (`/plans`) - Subscription plans
- **Payment Success** (`/payment/success`) - Payment confirmation
- **Payment Failed** (`/payment/failed`) - Payment error handling
- **Invoice Details** (`/invoices/:id`) - Individual invoice view

### Authentication
- **Sign In** (`/signin`) - User login
- **Sign Up** (`/signup`) - User registration
- **Forgot Password** (`/forgot-password`) - Password reset
- **Verify Email** (`/verify-email`) - Email verification
- **Onboarding** (`/onboarding`) - New user setup

### Additional Features
- **Multi-API Demo** (`/multi-api-demo`) - Combined API demonstration
- **Webhooks** (`/webhooks`) - Webhook configuration
- **Examples** (`/examples`) - Code examples
- **Getting Started** (`/getting-started`) - Onboarding guide
- **Status** (`/status`) - System status
- **Help** (`/help`) - Support resources
- **Contact** (`/contact`) - Contact information

### Legal & Compliance
- **Terms of Service** (`/terms`)
- **Privacy Policy** (`/privacy`)
- **Cookie Policy** (`/cookies`)
- **Changelog** (`/changelog`)

### Administration (Admin Only)
- **Admin Dashboard** (`/admin`)
- **User Management** (`/admin/users`)
- **Blog Management** (`/admin/blog`)
- **Theme Management** (`/admin/themes`)
- **Tutorial Management** (`/admin/tutorials`)

### System
- **Setup** (`/setup`) - Initial system configuration
- **404 Not Found** (`*`) - Error page for invalid routes

## Key Components

### Core Components
- **Navigation** - Main site navigation with API dropdown
- **Hero** - Landing page hero section
- **Features Section** - Platform features overview
- **Pricing Section** - Subscription plans display
- **API Showcase** - API capabilities demonstration

### User Management
- **Protected Route** - Authentication wrapper
- **Organization Switcher** - Multi-organization support
- **Chat Button** - Support chat interface

### API Integration
- **API Reference** - Technical API documentation
- **API Testing** - Interactive API testing tools
- **Usage Charts** - API usage analytics

### Specialized Components
- **Quantum Optimizer** - NP-complete problem solver interface
- **Quantum Stock Market** - Financial prediction tools
- **Quaternionic Communication** - Advanced communication protocols
- **QLLM Playground** - Language model interface

## Technology Stack
- **Frontend**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for API state
- **Authentication**: Custom auth system with JWT
- **Backend**: Go-based API server
- **Database**: Supabase
- **Deployment**: Docker/Kubernetes

## Access Control
- **Public Routes**: Marketing pages, documentation, demos
- **Protected Routes**: Dashboard, account management, billing
- **Admin Routes**: Administrative functions
- **Dynamic Routes**: Blog posts, tutorials, invoices (with URL parameters)