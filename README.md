# dmc
Automatically generate a management console based on swagger data.

# Site

> access : [DMC](https://cam-inc.github.io/dmc/)

> access : [DMC(stg)](https://cam-inc.github.io/dmc/stg/)

> access : [DMC(dev)](https://cam-inc.github.io/dmc/dev/)

# QuickStart

```
$ npm install .
$ npm start # web server listen:8080
```

> access : [http://localhost:8080](http://localhost:8080)

- [riot.js](http://riotjs.com/)
- [swagger](http://swagger.io/)
- [postcss](http://postcss.org/)

# Develpment


## swagger-client(swagger-js) ビルド手順

3.xのビルド済ファイルが存在しないので、手動でビルドしてdist/swagger-client.jsに配置する。

node.js v0.6で下記の作業はする必要がある


```
$ git clone https://github.com/swagger-api/swagger-js
$ swagger-js
$ npm install
$ npm run build-bundle
$ ls browser/swagger-client.js
```

> TODO もっといい組み込み方があるはず

# Release

```
# for develop
$ npm run release:dev
# for staging
$ npm run release:stg
# for production
$ npm run release:prd
```
> access : [DMC](https://cam-inc.github.io/dmc/)

> access : [DMC(stg)](https://cam-inc.github.io/dmc/stg/)

> access : [DMC(dev)](https://cam-inc.github.io/dmc/dev/)
