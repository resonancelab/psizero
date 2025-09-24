# Local Development Guide

This guide provides detailed instructions for setting up and running the PsiZero platform on your local machine for development purposes. The entire local environment is managed by Tilt for a streamlined, one-command setup.

## 🚀 Quick Start

1.  **Prerequisites**:
    *   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Kubernetes enabled)
    *   [Tilt](https://tilt.dev/)
    *   [Node.js](https://nodejs.org/) 18+
    *   [Helm](https://helm.sh/)

2.  **Start the Environment**:
    Navigate to the project root and run:
    ```bash
    tilt up
    ```

3.  **Access the Application**:
    *   **PsiZero App**: `http://localhost:8080`
    *   **Tilt UI**: `http://localhost:10350` (for logs and service status)

## ⚙️ How It Works

The `tilt up` command reads the `Tiltfile` in the project root and orchestrates the entire local development environment:

*   **Builds Frontend**: It builds the React application into static files.
*   **Builds Backend**: It builds the Go backend API.
*   **Serves Frontend from Backend**: The Go backend serves the static frontend files, eliminating CORS issues.
*   **Live Reloading**: It watches your source code for changes and automatically rebuilds and redeploys the relevant services, giving you a fast feedback loop.

## 🔑 First-Time Setup: Creating the Sysadmin User

When you run `tilt up` for the first time on a clean database, you will need to create the initial administrator account.

1.  **Start the Environment**: Run `tilt up`.
2.  **Navigate to the Setup Page**: Open your browser and go to `http://localhost:8080/setup`.
3.  **Create Admin**: You will see the **System Administrator Setup** form. Fill it out to create your initial administrator account.
4.  **Redirect to Home**: Upon successful creation, you will be redirected to the homepage, and the application will be ready for use.

The `/setup` route is only intended for this initial, one-time setup.

## 🔧 Local Development Workflow

Your day-to-day workflow will be simple:

1.  **Start Everything**:
    ```bash
    tilt up
    ```
2.  **Develop**:
    *   Make code changes in the `src/` directory for the frontend or in the respective backend service directories.
    *   Tilt will automatically redeploy the changes.
    *   View logs for any service in the Tilt UI (`http://localhost:10350`).
3.  **Stop Everything**:
    ```bash
    tilt down
    ```

## 🌐 Environment Configuration

The local environment is now served entirely by the Go backend on port 8080.

*   **API Base URL (`.env.local`)**: `VITE_API_BASE_URL` is set to `/v1`, as all API calls are now relative to the root of the server.
*   **No More Proxy**: The Vite proxy is no longer needed, as the frontend and backend are served from the same origin.

## 🐛 Troubleshooting

*   **`tilt up` fails**:
    *   Ensure Docker Desktop is running and its Kubernetes cluster is enabled.
    *   Run `tilt doctor` to diagnose issues with your Tilt installation.
    *   Make sure you have sufficient memory allocated to Docker (at least 8GB is recommended).
*   **Services won't start**:
    *   Check the logs for the failing service in the Tilt UI.
    *   Common issues include missing environment variables or database connection problems.
*   **"Failed to fetch" errors**:
    *   This indicates a problem with the backend API. Check the logs for the `psizero-api` service in the Tilt UI for errors.

---

**Note**: The `./deploy.sh` script is **exclusively for deploying to Google Cloud** and should not be used for local development.