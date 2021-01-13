# example api (nodejs)

Provides an Example API environment using Skaffold.

## Quick Start

### Advance preparation

#### Install Skaffold

```bash
brew install skaffold
```

> Other installation methods. [skaffold document](https://skaffold.dev/docs/install/)

#### Install Docker

- Docker for Desktop. [Download site](https://www.docker.com/products/docker-desktop)
- ✅ Enable Kubernetes (Required)
  > Settings : [Preferences] -> [Kubernetes] -> [Enable Kubernetes]

### Run

```bash
skaffold dev --port-forward
```

**Access**

- API Server : `http://localhost:3000`
- NodeJS Debug
  - Host: `127.0.0.1`
  - Port: `9229`
