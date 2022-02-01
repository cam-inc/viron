---
title: URL
---

## Environments

There are two environments: **production** and **development**. The difference is that `production` is for everyone who uses Viron, while `development` is for only maintainers and contributors. You need permission to access to be in the development environment.

## URL Types

Each environment has these four types of URLs:

- **Latest**: for the latest version of Viron.
- **Snapshot**: for fixed versions of Viron.
- **Website**: for documentation and blog site.
- **API**: for demo.

Use the `Latest` type to access the newest version of Viron. If you want to stick to a particular version, use `Snapshot` type.

| env| type | S3 Bucket | Directory in the bucket | URL |
| ---- | ---- | ---- | ---- | ---- |
| production | latest | s3://app.viron.plus | - | https://viron.plus/ |
| production | snapshot | s3://snapshot-app.viron.plus | semver名 | https://snapshot.viron.plus/{semver}/ |
| production | website | s3://discovery.viron.plus | - | https://snapshot.viron.plus/{semver}/ |
| production | api | - | - | https://demo.viron.plus/ |
| development | latest | s3://development-app.viron.work | - | https://viron.work/ |
| development | snapshot | s3://development-snapshot-app.viron.work | semver名 | https://snapshot.viron.work/{semver}/ |
| development | website | s3://development-discovery.viron.work | - | https://snapshot.viron.plus/{semver}/ |
| development | api | - | - | https://demo.viron.work/ |

## Deployment Flow

There are two primary branches in the GitHub repository: **main** and **development**.
The `main` branch is for the production environment and the development branch for the development environment, and each branch triggers `AWS CodePipeline tasks` as described below.

For URL types of `Latest` and `Snapshot`,

1. When pushed to the target branch,
2. AWS CodePipeline executes `npm run build --workspace=@viron/app` to generate static files
3. and deploys the output to the S3 bucket. (for the URL type of `Latest`)
4. It also runs `'npm run build:prefix --workspace=@viron/app` to generate and deploy. (for the URL type of `Snapshot`)

For URL type of `Website`, AWS CodePipeline executes `npm run build --workspace=@viron/website` and deploys the output files to the target S3 bucket.

Branches whose name prefixed with `snapshot-main-` or `snapshot-develop-` act the same as `main` and `development` branches above but only the `Snapshot-related tasks`.
