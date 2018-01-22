# example-google

An Example for Viron API Server.  
This project will provide a server that supports GoogleOAuth.  


# QuickStart

## Requirements

- [Docker for Mac](https://docs.docker.com/docker-for-mac/)
- [GCP](https://cloud.google.com) でOAuth2.0クライアントIDを払い出してください

  > [GoogleOAuth ドキュメント](https://cloud.google.com/docs/authentication)

## Start on Docker

```
$ cp -ip .env.template .env
$ # GCPで払い出したOAuth2.0クライアント情報を `GOOGLE_OAUTH_CLIENT_ID`,`GOOGLE_OAUTH_CLIENT_SECRET` に設定してください
$ npm run dressup
```

> 初回起動時はMySQLの初期化が必要なため数十秒〜数分かかる。  
> その間DB接続エラーが出続けるが、初期化完了後、正常に起動する。

## Add to Viron

1. [Viron](https://cam-inc.github.io/viron/latest) を開く
1. 管理画面の追加フォームに [https://localhost:3000/swagger.json](https://localhost:3000/swagger.json) を入力

  > 初回アクセス時はSSL自己証明書の警告が出るため、別タブでアクセスし警告を無視しておく必要がある。
  
1. Gmailアドレスで認証すればログインできる

# Structure

```
.
├── Dockerfile
├── README.md
├── app.js    (application entry point)
├── config    (swagger-express-mw configurations)
│   └── default.yaml
├── controllers
│   ├── root.js
│   ├── stats.js
│   ├── swagger.js
│   ├── user.js
│   ├── viron.js
│   ├── viron_account.js
│   ├── viron_admin_role.js
│   ├── viron_admin_user.js
│   ├── viron_audit_log.js
│   ├── viron_auth.js
│   └── viron_authtype.js
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
└── swagger
    └── swagger.yaml
```

# Tools

```
$ npm run
```
