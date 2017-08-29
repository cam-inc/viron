# 実装手順

ここではexample-nodeをベースに自サービスのDMCサーバを実装する手順について記述します。

## 準備

- Node.jsとmysqlのdocker imageを作成

```
$ cd /your/workspace
$ git clone git@github.com:cam-inc/Dockerfile.git
$ cd Dockerfile/
$ ./build.sh --node
$ ./build.sh --mysql
```

- example-nodeを自サービスのリポジトリにコピー
    - 各ディレクトリ/ファイルの詳細は [アーキテクチャ](architecture.md) に記述しています。

```
your-dmc-project
├── Dockerfile
├── README.md
├── api
│   ├── controllers
│   ├── fittings
│   └── swagger
├── app.js
├── config
│   └── default.yaml
├── docker
│   ├── mysql
│   └── overview.md
├── docker-compose.all.yml
├── docker-compose.db.yml
├── package.json
├── shared
│   ├── config
│   ├── constant.js
│   ├── context.js
│   ├── index.js
│   ├── middlewares
│   └── stores
└── test
    └── api
```

- "example-node" をプロジェクト名に変換

```
$ cd your-dmc-project
$ find . -type f | LC_ALL=C xargs sed -i "" 's/example-node/your-dmc-project/g'
```

- 不要なファイル/コードの削除
    - `api/controllers`, `shared/stores/mysql/models` の不要なファイルを削除
        - `index.js` のexportsを適宜修正
    - `api/swagger/swagger.min.yaml` を `api/swagger/swagger.yaml` にリネーム
    - `api/controllers/dmc.js` の不要な定義を削除

- 起動確認
    - 初回は数分かかります

```
$ npm run dressup
```

## CRUD追加

テーブルのCRUDを作成する手順です。

- modelを定義
    - `shared/stores/mysql/models` 配下に {{table_name}}.js を作成・実装
        - `index.js` にexportsの定義

- controllerの実装
    - `api/controllers/`  配下に {{table_name}}.js を作成
    - `list` `create` `remove` `show` `update` の5つのメソッドを実装
    - `{operationId: Function}` 形式でexportsを定義

- swaggerの記述
    - `swagger.yaml` に `paths` `definitions` を記述
    - `swagger.yaml` の書き方については [swagger](swagger.md)を参照


## example-nodeを流用しない場合

Node.jsやExpressについてある程度知識があり、クリーンな状態から実装したい場合は  
[swagger-node](https://github.com/swagger-api/swagger-node) を使用して構築可能です。

```
$ npm install -g swagger
$ swagger project create your-dmc-project
```
