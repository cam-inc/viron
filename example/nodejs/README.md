# example api (nodejs)

Provides an Example API environment using `docker-compose`.

## Quick Start

### Advance preparation

#### Install Docker

- Docker for Desktop. [Download site](https://www.docker.com/products/docker-desktop)

### Run

#### Use MySQL

```bash
npm run docker-compose:up:mysql
```

#### Use Mongo

```bash
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

### Temporary directory

- Data
  - MySQL
    - `data/mysql`
  - MongoDB
    - `data/mongo`

### Troubleshooting

TODO
