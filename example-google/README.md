# example-google

# QuickStart

## 前準備

- [Docker for Mac](https://docs.docker.com/docker-for-mac/) をインストール
- [GCP](https://cloud.google.com)でOAuth2.0クライアントIDを払い出してください

## 起動 on Docker

```
$ cp -ip .env.template .env
$ # 前準備で払い出したOAuth2.0クライアント情報をGOOGLE_OAUTH_CLIENT_ID,GOOGLE_OAUTH_CLIENT_SECRETに設定してください
$ npm run dressup
```

### ブラウザアクセス

- [api#swagger.json](https://localhost:3000/swagger.json)

# Tools

```
$ npm run
```
