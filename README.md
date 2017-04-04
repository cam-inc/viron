# dmc
Automatically generate a management console based on swagger data.

# QuickStart

## Example - API Server

@see: `example.go/README.md`

## Static Server

```
$ npm install .
$ npm start # web server listen:8080
```

> access : [http://localhost:8080](http://localhost:8080)

# Art

#### ScreenShot - endpoint page

<img src="https://github.com/cam-inc/dmc/raw/develop/art/endpoint.png" width="20%">

#### every system

<img src="https://github.com/cam-inc/dmc/raw/develop/art/every.png" width="60%">

#### check!! (rollup...)

<img src="https://github.com/cam-inc/dmc/raw/develop/art/build.png" width="60%">


# Links

- [riot.js](http://riotjs.com/)
- [Redux](http://redux.js.org/)
- [swagger](http://swagger.io/)
- [postcss](http://postcss.org/)
- Material Design Lite
  - [Official](https://getmdl.io/index.html)
  - [Dashboard#Example](https://getmdl.io/templates/dashboard/index.html)
  - [Tutorial](http://www.tutorialspark.com/Google_MaterialDesignLite_Tutorials/index.php)


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
