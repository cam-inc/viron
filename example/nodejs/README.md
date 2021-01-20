# example api (nodejs)

Provides an Example API environment using Skaffold.

## Quick Start

### Advance preparation

#### Install Skaffold

```bash
brew install skaffold
```

> Other installation methods. [skaffold document](https://skaffold.dev/docs/install/)
> 🌟 (Optional) Recommended products for viewing logs: `brew install stern`

#### Install Docker

- Docker for Desktop. [Download site](https://www.docker.com/products/docker-desktop)
- ✅ Enable Kubernetes (Required)
  > Settings : [Preferences] -> [Kubernetes] -> [Enable Kubernetes]

### Run

*Use MySQL*
```
npm run skaffold:dev:mysql
```
*Use Mongo*
```
npm run skaffold:dev:mongo
```

### CLI

- Run
  - MySQL Mode
    - `npm run skaffold:dev:mysql`
  - Mongo Mode
    - `npm run skaffold:dev:mongo`
- Clean
  - `npm run skaffold:delete`
- MySQL Access
  - `npm run skaffold:connect:mysql`
- Mongo Access
  - `npm run skaffold:connect:mongo`
- Print Logs
  - `npm run skaffold:logs`
- Other
  - `npm run`

**Access**

- API Server
  - URL: `http://localhost:3000`
- NodeJS Debug
  - Host: `127.0.0.1`
  - Port: `9229`
- MySQL
  - Host: `127.0.0.1`
  - Port: `3306`
- Mongo
  - Host: `127.0.0.1`
  - Port: `27017`

### Skaffold structure

- [x] Persistent Volume
  - [x] mysql
  - [x] mongo
- [x] Load Balancer
  - [x] example/nodejs
  - [x] mysql
  - [x] mongo
- [x] Port Forward
  - [x] node-inspector example/nodejs
