# Automatic System Administrator Setup

## Overview

The PsiZero Resonance Platform supports automatic creation of the initial system administrator account during deployment. This feature eliminates the need for manual setup when environment variables are provided, enabling streamlined deployment in automated environments.

## Configuration

### Environment Variables

The automatic setup is configured through two environment variables:

- `INITIAL_SETUP_USERNAME`: Email address for the system administrator account
- `INITIAL_SETUP_PASSWORD`: Password for the system administrator account

### Kubernetes Deployment

Add the environment variables to your Kubernetes deployment:

```yaml
# k8s/local/api-deployment.yaml
env:
  - name: INITIAL_SETUP_USERNAME
    value: "admin@example.com"
  - name: INITIAL_SETUP_PASSWORD
    value: "password123456"
```

### Local Development

For local development, add to your `.env.local` file:

```bash
INITIAL_SETUP_USERNAME=admin@example.com
INITIAL_SETUP_PASSWORD=password123456
```

## How It Works

### Backend Implementation

1. **Service Initialization**: When the Go backend starts, the service container checks for the presence of both environment variables.

2. **Database Check**: The system queries the database to determine if any system administrator already exists.

3. **Automatic Creation**: If no sysadmin exists and both environment variables are provided:
   - A new user account is created with the specified credentials
   - The password is securely hashed using bcrypt
   - The account is marked as a system administrator (`is_sysadmin: true`)

4. **Setup Status Endpoint**: The API provides a `/v1/auth/setup-status` endpoint that returns the setup completion status.

### Frontend Implementation

1. **Setup Detection**: The frontend setup page checks the setup status on component mount.

2. **Automatic Redirect**: If setup is already complete (sysadmin exists), users are automatically redirected to the login page.

3. **User Feedback**: Clear messages inform users about the automatic setup completion.

## API Endpoints

### GET /v1/auth/setup-status

Returns the current setup status of the system.

**Response:**
```json
{
  "setup_complete": true,
  "has_sysadmin": true,
  "message": "System administrator account already exists"
}
```

## Security Considerations

### Password Requirements

- Minimum 8 characters (enforced by frontend validation)
- Consider using strong, randomly generated passwords in production
- Passwords are hashed using bcrypt before storage

### Environment Variable Security

- Never commit credentials to version control
- Use Kubernetes secrets or secure environment variable management in production
- Rotate credentials regularly
- Consider using one-time setup tokens for enhanced security

### Access Control

- The automatic setup only creates the initial sysadmin account
- Additional security measures should be implemented for production deployments
- Consider IP restrictions for admin access

## Usage Scenarios

### Development Environment

```bash
# Set in .env.local
INITIAL_SETUP_USERNAME=dev-admin@localhost
INITIAL_SETUP_PASSWORD=dev-password-123
```

### Staging Environment

```yaml
# Kubernetes deployment
env:
  - name: INITIAL_SETUP_USERNAME
    valueFrom:
      secretKeyRef:
        name: setup-credentials
        key: username
  - name: INITIAL_SETUP_PASSWORD
    valueFrom:
      secretKeyRef:
        name: setup-credentials
        key: password
```

### Production Environment

Use Kubernetes secrets for secure credential management:

```bash
kubectl create secret generic setup-credentials \
  --from-literal=username=admin@yourcompany.com \
  --from-literal=password=your-secure-password
```

## Testing

### Verify Automatic Setup

1. Deploy with environment variables configured
2. Navigate to `http://localhost:5173/setup`
3. Verify automatic redirect to login page with completion message
4. Test login with configured credentials

### Manual Testing Steps

```bash
# 1. Check setup status
curl http://localhost:8080/v1/auth/setup-status

# 2. Verify sysadmin creation
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123456"}'
```

## Troubleshooting

### Common Issues

1. **Setup Not Completing**
   - Verify both environment variables are set
   - Check database connectivity
   - Review backend logs for errors

2. **Login Failures**
   - Confirm credentials match environment variables
   - Verify database schema matches expected columns
   - Check password hashing implementation

3. **Redirect Not Working**
   - Ensure frontend API client is configured correctly
   - Verify setup status endpoint is accessible
   - Check browser console for JavaScript errors

### Debug Commands

```bash
# Check environment variables in container
kubectl exec -it <pod-name> -- env | grep INITIAL_SETUP

# View backend logs
kubectl logs <pod-name> | grep -i setup

# Database verification
kubectl exec -it <postgres-pod> -- psql -U postgres -d psizero -c "SELECT email, is_sysadmin FROM users WHERE is_sysadmin = true;"
```

## Implementation Files

### Backend Files
- [`api/gateway/services/container.go`](../api/gateway/services/container.go): Automatic sysadmin creation logic
- [`api/gateway/router/auth.go`](../api/gateway/router/auth.go): Setup status endpoint
- [`api/shared/user.go`](../api/shared/user.go): User management and database operations

### Frontend Files
- [`src/components/SysadminSetup.tsx`](../src/components/SysadminSetup.tsx): Setup page with automatic detection
- [`src/lib/api/auth.ts`](../src/lib/api/auth.ts): API client for setup status

### Configuration Files
- [`k8s/local/api-deployment.yaml`](../k8s/local/api-deployment.yaml): Kubernetes deployment with environment variables
- [`.env.local`](../.env.local): Local development environment variables

## Best Practices

1. **Use Strong Passwords**: Generate secure passwords for production deployments
2. **Secure Storage**: Use Kubernetes secrets or secure environment variable management
3. **Rotate Credentials**: Regularly update administrator passwords
4. **Monitor Access**: Log and monitor administrative access
5. **Backup Strategy**: Ensure admin credentials are included in backup/recovery procedures

## Migration from Manual Setup

If you have an existing deployment with manual setup:

1. The automatic setup will detect existing sysadmin accounts
2. No additional sysadmin will be created
3. Existing credentials remain unchanged
4. Setup page will redirect to login automatically

This ensures backward compatibility with existing deployments.