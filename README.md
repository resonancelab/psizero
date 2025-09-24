# PsiZero Resonance Platform

A comprehensive quantum computing platform featuring real-time market prediction using advanced quantum algorithms.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for deployment)

### Local Development

For detailed instructions on setting up and running the platform on your local machine, please see the **[Local Development Guide](LOCAL_DEVELOPMENT.md)**.

The local environment is managed by Tilt for a streamlined, one-command setup:

```bash
# Start the entire application stack (frontend, backend, etc.)
tilt up
```

## 🔧 Environment Configuration

The application supports multiple environments with dynamic API configuration:

### Development (Local)
- **File**: `.env.local`
- **API Base URL**: `http://localhost:8080`
- **Backend Required**: Yes - connects to your local backend API
- **Features**: Real API integration with graceful fallbacks

### Staging
- **File**: `.env.staging`
- **API Base URL**: `https://staging-api.psizero.dev`
- **Backend Required**: Yes
- **Features**: Production-like environment

### Production
- **File**: `.env.production`
- **API Base URL**: `https://api.psizero.dev`
- **Backend Required**: Yes
- **Features**: Full production deployment

## 🌐 API Configuration

### Environment Variables

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `VITE_API_BASE_URL` | `/api` | `https://staging-api.psizero.dev` | `https://api.psizero.dev` | API endpoint |
| `VITE_API_PROXY_ENABLED` | `true` | `true` | `true` | Enable API proxy |
| `VITE_USE_MOCK_API` | `false` | `false` | `false` | Use mock responses when backend unavailable |
| `VITE_ENVIRONMENT` | `development` | `staging` | `production` | Environment name |

### Backend Connection (Development)

The application connects to your real backend API running on `localhost:8080`:

- ✅ **Real API integration** during development
- ✅ **Live backend testing** and debugging
- ✅ **Actual quantum computations** from your backend
- ✅ **Graceful fallbacks** when backend is unavailable

### Fallback Mode (Optional)

If `REACT_APP_USE_MOCK_API=true`, the application uses simulated responses when the backend is unavailable:

- ✅ **Development without backend** running
- ✅ **Realistic response simulation** for testing
- ✅ **Error handling testing** capabilities
- ✅ **All features functional** for UI development

### API Services

The platform integrates multiple quantum computing APIs:

- **HQE**: Holographic Quantum Encoder
- **QSEM**: Quantum Semantic Analysis
- **I-Ching**: Pattern Evolution Oracle
- **NLC**: Non-Local Communication
- **Unified Physics**: Emergent Gravity Computation

## 🏗️ Deployment

### Google Cloud Platform

1. **Set up Google Cloud Project**
   Follow the guide in the deployment section of this README.

2. **Run the Deployment Script**
   ```bash
   ./deploy.sh
   ```
   This script now automatically generates a secure, one-time setup token and passes it to your backend as the `INITIAL_SETUP_TOKEN` environment variable.

3. **First-Time Setup**
   - After deployment, navigate to your application's URL.
   - You will be greeted with a "System Administrator Setup" page.
   - Create your initial administrator account. This can only be done once.

4. **Environment Variables**
   The deployment script handles setting `NODE_ENV` and the setup token. You can add more variables as needed:
   ```bash
   gcloud run services update psizero-frontend \
       --update-env-vars "REACT_APP_API_BASE_URL=https://api.psizero.dev,NEW_VAR=VALUE"
   ```

### Docker Deployment

```bash
# Build the image
docker build -t psizero-frontend .

# Run locally
docker run -p 80:80 psizero-frontend
```

## 📊 Features

### Quantum Stock Market Oracle
- Real-time market data integration
- Multi-asset support (BTC, ETH, ADA, SOL, DOT, LINK, UNI, AAVE)
- Quantum-enhanced predictions
- 3D visualization of quantum states
- Confidence scoring and risk assessment

### API Management
- Real-time connection monitoring
- Usage tracking and rate limiting
- Graceful fallback handling
- Error recovery and retry logic

### Development Tools
- Hot reload development server
- Mock API for offline development
- Comprehensive error logging
- Performance monitoring

## 🔐 Security

- API keys stored locally (never sent to our servers)
- HTTPS encryption in production
- Rate limiting and abuse prevention
- Secure environment variable handling

## 📈 Performance

- Optimized bundle size with code splitting
- Lazy loading of heavy components
- Efficient caching strategies
- CDN integration for static assets

## 🛠️ Development Tools

### Development Setup Script

Use the included development setup script for a streamlined experience:

```bash
# Check backend status and start frontend
./dev-setup.sh

# Just check if backend is running
./dev-setup.sh check-backend

# Start only the frontend
./dev-setup.sh frontend
```

The script will:
- ✅ Check if your backend API is running on `localhost:8080`
- ✅ Display current configuration
- ✅ Start the frontend development server
- ✅ Provide helpful error messages and guidance

## � Troubleshooting

### Common Issues

1. **Backend API Connection Issues**
   ```bash
   # Check if backend is running
   ./dev-setup.sh check-backend

   # Test API connection manually
   curl http://localhost:8080/health

   # Check environment variables
   cat .env.local
   ```

2. **Build Issues**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules/.vite
   npm run build
   ```

3. **Fallback Mode (When Backend is Unavailable)**
   ```bash
   # Enable fallback predictions in .env.local
   echo "REACT_APP_USE_MOCK_API=true" >> .env.local

   # Restart the development server
   npm run dev
   ```

4. **Environment Variable Issues**
   ```bash
   # Check current environment variables
   grep REACT_APP .env.local

   # Verify Vite is loading them
   npm run dev -- --mode development
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with mock API enabled
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

**Built with ❤️ using React, TypeScript, and cutting-edge quantum computing APIs**
