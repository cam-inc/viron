# example api (nodejs)

Provides an Example API environment using `docker-compose`.

## Quick Start

### Advance preparation

#### Install Docker

- Docker for Desktop. [Download site](https://www.docker.com/products/docker-desktop)

#### Cert Files

Create SSL certificates using mkcert for `local-api.viron.work` domain and place them under the `./cert` directory:

```shell
# Install mkcert (if not already installed)
# macOS: brew install mkcert
# Linux: see https://github.com/FiloSottile/mkcert#installation

# Install the local CA
mkcert -install

# Generate certificates for local-api.viron.work
mkcert -cert-file ./cert/viron.crt -key-file ./cert/viron.key local-api.viron.work
```

#### .env

```shell
cp -ip .env.template .env
```

and, put secrets of your project.

### Run

#### Use MySQL

```shell
npm run docker-compose:up:mysql
```

#### Use Mongo

```shell
npm run docker-compose:up:mongo
```

### CLI

- Run
  - MySQL Mode
    - `npm run docker-compose:up:mysql`
  - Mongo Mode
    - `npm run docker-compose:up:mongo`
- MySQL Access (CLI)
  - `npm run docker-compose:connect:mysql`
- Mongo Access (CLI)
  - `npm run docker-compose:connect:mongo`
- Other
  - `npm run`

#### Access

- API Server
  - URL: `https://local-api.viron.work:3000`
- NodeJS Debug
  - Host: `127.0.0.1`
  - Port: `9229`
- MySQL
  - Host: `127.0.0.1`
  - Port: `3306`
- Mongo
  - Host: `127.0.0.1`
  - Port: `27017`

### Temporary directory

- Data
  - MySQL
    - `data/mysql`
  - MongoDB
    - `data/mongo`

### Troubleshooting

#### To build with force recreation

Try recreating it from the repository root using the following command.

```shell
npm run example --  --build --force-recreate
```
