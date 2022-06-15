# example api (Go)

Provides an Example API environment using `docker-compose`.

## Quick Start

### Advance preparation

#### Install Docker

- Docker for Desktop. [Download site](https://www.docker.com/products/docker-desktop)

#### Cert Files
Get `viron.crt`, `viron.csr` and `viron.key` files and place them under the `example/[lang]/cert` directory.

#### .env

```bash
cp -ip .env.template .env
```
and, put secrets of your project.

### Run

#### Use MySQL

```bash
docker-compose -f ./docker-compose.example-golang.mysql.yml up
```

#### Use Mongo

```bash
docker-compose -f ./docker-compose.example-golang.mongo.yml up
