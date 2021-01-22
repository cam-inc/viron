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

#### Use MySQL

```bash
npm run skaffold:dev:mysql
```

#### Use Mongo

```bash
npm run skaffold:dev:mongo
```

### CLI

- Run
  - MySQL Mode
    - `npm run skaffold:dev:mysql`
  - Mongo Mode
    - `npm run skaffold:dev:mongo`
- Clean
  - MySQL Mode
    - `npm run skaffold:delete:mysql`
  - Mongo Mode
    - `npm run skaffold:delete:mongo`
- MySQL Access
  - `npm run skaffold:connect:mysql`
- Mongo Access
  - `npm run skaffold:connect:mongo`
- Print Logs
  - `npm run skaffold:logs`
- Other
  - `npm run`

#### Access

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

- Persistent Volume
  - `mysql`
  - `mongo`
- Load Balancer
  - `example/nodejs`
  - `mysql`
  - `mongo`
- Port Forward
  - node-inspector `example/nodejs`
- Namespace
  - `viron-nodejs`

### Troubleshooting

TODO
