# viron-demo

# QuickStart

## Requirements

- [Docker for Mac](https://docs.docker.com/docker-for-mac/)

## Start on Docker

```
$ cp -ip .env.template .env
$ # 必要に応じて.envを編集してください
$ npm run dressup
```

> 初回起動時はMySQLの初期化が必要なため数十秒〜数分かかる。  
> その間DB接続エラーが出続けるが、初期化完了後、正常に起動する。

## Add to Viron

1. [Viron(v1)](https://cam-inc.github.io/viron/v1) を開く
1. 管理画面の追加フォームに [https://localhost:3000/swagger.json](https://localhost:3000/swagger.json) を入力

> 初回アクセス時はSSL自己証明書の警告が出るため、別タブでアクセスし警告を無視しておく必要がある。

# Structure

```
.
├── Dockerfile
├── README.md
├── app.js    (application entry point)
├── config    (swagger-express-mw configurations)
│   └── default.yaml
├── controllers
│   ├── blog_design.js
│   ├── default.js
│   ├── format.js
│   ├── formdata.js
│   ├── multiquery.js
│   ├── nested_array.js
│   ├── ping.js
│   ├── root.js
│   ├── stats.js
│   ├── stats_chart.js
│   ├── swagger.js
│   ├── user.js
│   ├── user_blog.js
│   ├── user_blog_entry.js
│   ├── user_favorite.js
│   ├── validator.js
│   ├── viron.js
│   ├── viron_account.js
│   ├── viron_admin_role.js
│   ├── viron_admin_user.js
│   ├── viron_audit_log.js
│   ├── viron_auth.js
│   ├── viron_authtype.js
│   └── viron_autocomplete.js
├── docker-compose.all.yml
├── docker-compose.db.yml
├── fittings    (single steps for swagger-express-mw)
│   ├── error_handler.js
│   ├── middlewares.js
│   └── swagger_validator.js
├── mysql.env
├── package.json
├── shared
│   ├── config    (application configurations)
│   ├── constant.js
│   ├── context.js
│   ├── index.js
│   └── stores    (MySQL model definitions)
├── swagger
│   └── swagger.yaml
└── test
    ├── api
    └── index.js
```

# Tools

```
$ npm run
```
