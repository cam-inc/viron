---
title: Migrating to v2
---

Vironサーバーをv1からv2へマイグレーションする手順について。
前提として、v1サーバは [node-vironlib](https://www.npmjs.com/package/node-vironlib) を使用しているものとし、
v2サーバでは [@viron/lib](https://www.npmjs.com/package/@viron/lib) を使用する。

## Migration from Swagger 2 to OpenAPI 3

`Swagger 2.0` で書かれたAPI仕様書を `OpenAPI 3.0.2` にコンバートする。

e.g.) [swagger2openapi](https://www.npmjs.com/package/swagger2openapi)

```
$ npm i swagger2openapi
$ npx swagger2openapi --outfile ./openapi.yaml --targetVersion 3.0.2 --yaml /path/to/swagger.yaml
```

### Use OpenAPI specifications provided by @viron/lib

`@viron/lib` は個別の機能で使用できるAPI仕様書を提供している。
これまではプロジェクトのAPI仕様書にライブラリの機能について記述する必要があったが、v2では必要ない。
[@viron/libが提供するAPI仕様書](https://github.com/cam-inc/viron/tree/develop/packages/nodejs/src/openapi) を動的または静的にプロジェクトのAPI仕様書にマージしてください。

## Modifing Server Implements

### Application Framework

`node-vironlib` は [Express](https://expressjs.com/) 専用のライブラリだが、 `@viron/lib` はフレームワークに依存しない。
[example](https://github.com/cam-inc/viron/tree/develop/example/nodejs) では `Express` を使用しているが、好きなフレームワークで実装可能。

### OpenAPI Integration Library

API仕様書のメジャーバージョンアップを行ったため、OpenAPIを扱うライブラリは変更が必要かもしれない。
例えば [swagger-express](https://www.npmjs.com/package/swagger-express-mw) や [swagger-tools](https://www.npmjs.com/package/swagger-tools) は `OpenAPI 3` には対応していないため、変更が必要。
[example](https://github.com/cam-inc/viron/tree/develop/example/nodejs) では [exegesis-express](https://www.npmjs.com/package/exegesis-express) を使用している。

### Modifing Required APIs

v1には3つの必須APIがありました。
v2で不要になったAPI、仕様が変わったAPIについて記述する。

#### Endpoint

API仕様書を取得するAPIは引き続き必要。
`@viron/lib` では `domainsOas.get()` でパーソナライズされたAPI仕様書を取得できる。

```js
app.get('/oas.json', async (req, res) => {
  const result = await domainsOas.get(
    apiDefinition, // All OAS Document
    {
      'x-theme': 'red' 
    }, // info extentions
    ['viewer'] // role ids
  );
  res.json(result);
});
``` 

#### Get Page Definitions (/viron)

v2では `/viron` は廃止された。
`/viron` で返していたコンポーネント定義は、API仕様書に含める必要がある。

```json
{
  "info": {
    "x-pages": [
      {
        "id": "vironAuditLog", // unique page id
        "group": "管理画面/管理", // Manage groups separated by `/`
        "title": "Viron 監査ログ", // title of the page.
        "description": "# 監査ログの閲覧\\nVironサーバの監査ログを閲覧します。", // markdown can be used.
        "contents": [
          {
            "title": "監査ログ", // title of the content.
            "type": "table", // content type. table|number
            "operationId": "listVironAuditlogs", // The operation that is called when that menu is selected.
            "pagination": true, // Enable to pagination
            "resourceId": "vironAuditLog", // Resource id used for role management.
            "defaultParametersValue": {}, // Request parameters sent when that menu is selected.
            "autoRefreshSec": 60, // Auto-update interval in seconds
            "actions": [
              {
                "operationId": "downloadLogs",
                "defaultParametersValue": {}
              }
            ], // Related operations
          }
        ] // Contents of the page.
      }
    ]
  },
}
```

#### Get Authorization Types (/viron_authtype)

認証方式を取得するAPIは仕様が変更されました。
パスは自由に指定できるようになり、細かい制御ができるようになった。

1. APIのパスはエンドポイント呼び出し時のレスポンスヘッダで指示する。
※ エンドポイントが認証エラーを返す場合も必要なので注意する。

```js
app.get('/oas.json', async (req, res) => {
  const result = await domainsOas.get({...});
  res.set('x-viron-authtypes-path', '/viron/authconfigs');
  res.json(result);
});
```

2. 認証方式取得APIを実装する。
使用する認証方式の一覧とAPI仕様書を `domainsAuthConfigs.genAuthConfigs()` に渡すことで必要なデータを生成できる。

```js
app.get('/viron/authconfigs', async (req, res) => {
  const authConfigs = domainsAuthConfigs.genAuthConfigs(
    [
      {
        provider: 'viron',
        type: 'email',
        method: 'post',
        path: '/email/signin',
      },
      {
        provider: 'google',
        type: 'oauth',
        method: 'get',
        path: '/oauth2/google/authorization'
      },
      {
        provider: 'google',
        type: 'oauthcallback',
        method: 'post',
        path: '/oauth2/google/callback'
      },
      {
        provider: 'signout',
        type: 'signout',
        method: 'post',
        path: '/signout'
      }
    ],
    apiDefinition, // All OAS Document
  );
  res.json(authConfigs);
});
```

### テーブルの仕様変更対応

コンテンツタイプが `table` の場合のリスト取得APIの仕様について。
v1ではAPIは配列をレスポンスボディに返すだけだったが、v2ではページャ関連のデータも合わせて返す。
※ API仕様書も変更が必要なので注意する。

```js
app.get('/auditlogs', async (req, res) => {
  res.json({
    list: [ {}, {}, {} ],
    maxPage: 99,
    currentPage: 2
  });
});
```

キーである `list`, `maxPage`, `currentPage` はAPI仕様書で定義できる。

```json
{
  "info": {
    "x-table": {
      "responseListKey": "list",
      "pager": {
        "responseMaxpageKey": "maxPage",
        "responsePageKey": "currentPage"
      }
    }
  }
}
```

`X-Pagination-Limit`, `X-Pagination-Total-Pages`, `X-Pagination-Current-Page` レスポンスヘッダは不要。

