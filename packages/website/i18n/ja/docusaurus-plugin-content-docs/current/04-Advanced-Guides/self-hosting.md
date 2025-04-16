---
title: Self Hosting
---

The URL of [https://viron.plus](https://viron.plus) is the destination of Viron's official application, where all endpoints will be managed. But you can host a copy of the Viron application wherever you want by following the steps below to improve security.

## Clone and Build

Clone the [GitHub repository](https://github.com/cam-inc/viron) and set up your development environment, referring to the [README.md](https://github.com/cam-inc/viron/tree/develop/packages/app) in the package.

```shell
git clone git@github.com:cam-inc/viron.git viron
cd viron
npm install . --legacy-peer-deps
npm run build --workspace=@viron/app --workspace=@viron/lib
npm run dev --workspace=@viron/app
```

Once you satisfy editing the code, build the package to get the static files to deploy.

```shell
npm run build --workspace=@viron/app
```

## Deployment

Deploy the output files under the `public` directory on any static file server you choose. Since the Viron application package uses [Gatsby](https://www.gatsbyjs.com/), you need to properly set up `HTTP caching` following [Gatsby's official guide](https://www.gatsbyjs.com/docs/caching/).
