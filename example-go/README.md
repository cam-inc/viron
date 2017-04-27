# example.go


# QuickStart

## 前準備

- [Docker for Mac](https://docs.docker.com/docker-for-mac/) をインストール


## 起動 on Docker

```
$ GOOGLE_OAUTH_CLIENT_ID={ClientID} GOOGLE_OAUTH_CLIENT_SECRET={ClientSecret} make dressup
```

> 初回のみ 10min ぐらいかかります

> ClientID, ClientSecretはわかる人に聞いてください

> .bashrc等でexportしておいてもOKです

> IDEを使用する場合は別途IDEの実行/デバッグ時の設定が必要です

### ブラウザアクセス

- [api#ping](http://localhost:3000/ping)
- [api#swagger](http://localhost:3000/swagger.json)
- [realize page](http://localhost:4000)

# ビルド

```
$ make build-docker
```

# Program Checker

```
$ make check
```

# Feature

- [x] プログラム ホットリロード サポート
- [x] docker-compose サポート
- [x] goconvey サポート
- [x] MySQL サポート
- [ ] Fluentd サポート
- [ ] GUID払い出し サポート
- [ ] AWS ECS へのシームレスなデプロイ


# QA

- Q. `cannot execute binary file`
  - A. docker上でビルドしたものを使用している。(その逆も)

# Tools

- `$ make example-go-ssh` SSH example-go on docker-compose
- `$ mysql-ssh` SSH mysql on docker-compose
- `$ mysql-client` Access mysql client on docker-compose
- `$ goconvey` Start web visualize go testing tools. [experiments]
- `$ gen` Generate goa all (ignore: gen-main)
- `$ gen-main` Generate goa [main]

> Makefile read more .... `$ make help`
