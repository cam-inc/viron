# example api (nodejs)

Provides an Example API environment using `docker-compose`.

## Quick Start

### Advance preparation

#### Install Docker

- Docker for Desktop. [Download site](https://www.docker.com/products/docker-desktop)

#### Cert Files

Get `viron.crt`, `viron.csr` and `viron.key` files and place them under the `example/[lang]/cert` directory.

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
