---
title: viron/lib
---

Vironサーバーを構築する上で必要な機能群をまとめたライブラリ。
特定のフレームワークに依存しない関数群のみを提供している。
JavaScript(TypeScrpit)およびGolangをサポート。
サンプルはTypescriptで記述。

- [x] OpenAPI Specification(oas)
ファイルのロードや$refの解決など、oasを扱う上で有用な機能を提供する。

  - ロード
    - yaml または json ファイルをロードし、オブジェクトを生成する
      - $ref は同時に解決される

  ``` js
  const { domainsOas } from '@viron/lib';

  const path = '/path/to/spec.yaml';
  const apiDefinition = await domainsOas.loadResolvedOas(path);
  ```

- ユーザーに最適化したoasを取得
  - エンドポイントへのリクエストはこの関数で生成したoasを返却する
  - 引数 `infoExtentions` で `.info` を上書き可能
    ex.) 環境間でテーマやタグを変える
  - 引数 `roleIds` で、操作可能なオペレーションに絞り込んだoasを生成

  ``` js
  const { domainsOas } from '@viron/lib';

  const infoExtentions = {
    'x-theme': 'red',
    'x-tags': ['example', 'production']
  };
  const roleIds = ['viewer'];
  const optimizedApiDefinition = await doaminsOas.get(apiDefinition, infoExtentions, roleIds);
  res.json(optimizedApiDefinition); 
  ```

- 参照($ref)解決
  - OpenAPIオブジェクトの$refを解決する

  ``` js
  const { domainsOas } from '@viron/lib';

  const apiDefinition = {
    components: {
      schemas: {
        Foo: {
          type: object,
          properties: {
            bar: {
              $ref: '#/components/schemas/Bar'
            }
          }
        },
        Bar: {
          type: string
        }
      }
    }
  };
  const resolvedSchema = await domainsOas.dereference(apiDefinition);
  ```

  - @viron/libが提供する機能のoasのパスを取得

  ``` js
  const { domainsOas } from '@viron/lib';

  const path = domainsOas.getPath('adminusers');
  ```

  - 複数のoasをマージ

  ``` js
  const { domainsOas } from '@viron/lib';

  const merged = domainsOas.merge(oas1, oas2,,,);
  ```

- [x] Authentication
パスワード認証およびGoogleOAuth2を利用した認証に必要な機能を提供している。
  - config
    - JWT

  ``` json
  {
    secret: 'XXXXXX', // ハッシュ化に用いる秘密鍵
    provider: 'example', // JWTの発行者
    expirationSec: 24 * 60 * 60 // 有効期間(秒)
  } 
  ```

- Google OAuth2

  ``` json
  {
    clientId: 'XXXX', // OAuth2.0 クライアントID
    clientSecret: 'XXXXXXXX', // クライアントシークレット
    additionalScopes: [], // https://www.googleapis.com/auth/userinfo.email 以外のスコープをリクエストする場合に指定する
    userHostedDomains: ['example.com'], // 利用可能なメールドメイン
  }
  ```

スコープ一覧: [https://developers.google.com/identity/protocols/oauth2/scopes]

- JWTインスタンスの初期化
  - サーバー起動時に1度実行すればOK

  ``` js
  import { domainsAuth } from '@viron/lib'

  // 初期化
  domainsAuth.initJwt(configJwt);
  ```

- サインイン
  - パスワード認証

  ``` js
  const token = await domainsAuth.signinEmail(email, password);
  // `token` を set-cookie ヘッダにセットしてレスポンスする
  ```

- Google OAuth2

  ``` js
  /** redirect to google authorization url */
  const state = domainsAuth.genState();
  const authorizationUrl = domainsAuth.getGoogleOAuth2AuthorizationUrl(
    redirectUri,
    state,
    configGoogle
  );
  // `state` を set-cookie ヘッダにセットし、`authorizationUrl` へリダイレクトする

  /** callback from google */
  const { code, state, redirectUri } = req.body;
  const cookieState = req.cookies[COOKIE_KEY.OAUTH2_STATE];
  if (state !== cookieState) {
    throw new Error('illegal request');
  }

  const token = await domains.signinGoogleOAuth2(
    code,
    redirectUri,
    configGoogle
  );
  // `token` を set-cookie ヘッダにセットしてレスポンスする
  ```

- JWTおよびアクセストークンの検証
  - OpenAPIでsecurityを定義しているすべてのオペレーションで実施する

  ``` js
  import { domainsAuth } from '@viron/lib'

  // JWTの検証
  const token = req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  const claims = await domainsAuth.verifyJwt(token); // claimsが取得できればOK

  // Google認証の場合はアクセストークンも検証する
  const valid = await domainsAuth.verifyGoogleOAuth2AccessToken(
    claims.sub,
    {
      googleOAuth2AccessToken: '';
      googleOAuth2ExpiryDate: 1234567890;
      googleOAuth2IdToken: '';
      googleOAuth2RefreshToken: '';
      googleOAuth2TokenType: '';
    },
    configGoogle
  );
  ```

- サインアウト

  ``` js
  const token = req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  await domainsAuth.signout(token);
  // cookieから `COOKIE_KEY.VIRON_AUTHORIZATION` をクリアする
  ```

- [x] AuthConfig
サーバがサポートしている認証方式をブラウザに伝えるための設定。
  - エンドポイントのレスポンスヘッダに `x-viron-authtypes-path` ヘッダを返す
    - エンドポイントが認証エラーを返す場合もセットする必要があるため注意が必要

  ```js
  res.set(HTTP_HEADER.X_VIRON_AUTHTYPES_PATH, VIRON_AUTHCONFIGS_PATH);
  ```

- `VIRON_AUTHCONFIGS_PATH` へのGETリレクエストで、認証方式を返す
  - Google認証を使いたくない場合などはこのスポンスにGoogle関連の情報を返さないようにする

  ```js
  import { domainsAuthConfigs } from '@viron/lib'

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
    apiDefinitions // oas
  );
  res.json(authConfigs);
  ```

- [x] AdminRole
Vironを利用するユーザーの役割を管理する機能を提供している。
`casbin` を使ったRBACを採用しており、リソースごとに操作権限(READ,WRITE,ALL,DENY)を設定する。
READ: GET
WRITE: GET, POST, PUT, PATCH
ALL: GET, POST, PUT, PATCH, DELETE
DENY: none

  リソースIDはOpenAPIの `.info['x-pages'][].contents[].resourceId` で設定でき、
  特定のリソースに関連するすべてのオペレーションが同じリソースIDであるとみなされる。

  ex.)

  ``` yaml
  info:
    x-pages:
      - contents:
        - operationId: listUsers
          resourceId: user
        - operationId: listBooks
          resourceId: book

  paths:
    /users:
      get:
        operationId: listUsers # operationIdが一致するためリソースIDは `user`
      post:
        operationId: createUser # operationIdは一致しないが関連があるのでリソースIDは `user`
    /users/{userId}:
      put:
        operationId: updateUser # operationIdは一致しないが関連があるのでリソースIDは `user`
    /books:
      get:
        operationId: listBooks # operationIdが一致するためリソースIDは `book`
  ```

- 作成

  ```js
  import { domainsAdminRole } from '@viron/lib';

  const adminRole = await domainsAdminRole.createOne(req.body);
  ```

- 更新

  ```js
  import { domainsAdminRole } from '@viron/lib';

  await domainsAdminRole.updateOneById(req.params.id, req.body);
  ```

- 削除

  ```js
  import { domainsAdminRole } from '@viron/lib';

  await domainsAdminRole.removeOneById(req.params.id);
  ```

- リスト取得

  ```js
  import { domainsAdminRole } from '@viron/lib';

  const adminRoles = await domainsAdminRole.listByOas(apiDefinition);
  ```

- 特権ロールについて
  - `super`
    - すべてのリソースにフルアクセスを持つ管理者用のロール
    - システム管理者の中で最も信頼できる極少数にのみ付与する
  - `viewer`
    - サーバーの初回起動時に自動的に作成され、その時点で存在するすべてのリソースに `READ` 権限を持つロール
    - ユーザーがVironに初回ログインした際に自動的に付与される

- [x] AdminUser

  Vironを利用するユーザーを管理する機能を提供している。
  ユーザー情報として、認証方式および認証に用いるクレデンシャルなどが管理されている。
  ユーザーのロールは `casbin` で管理され、1人のユーザーは複数のロールを持つことができる。

- 作成

  ```js
  import { domainsAdminUser } from '@viron/lib';

  const adminUser = await domainsAdminUser.createOne(req.body);
  ```

- 更新

  ```js
  import { domainsAdminUser } from '@viron/lib';

  await domainsAdminUser.updateOneById(req.params.id, req.body);
  ```

- 削除

  ```js
  import { domainsAdminUser } from '@viron/lib';

  await domainsAdminUser.removeOneById(req.params.id);
  ```

- リスト取得

  ``` js
  import { domainsAdminUser } from '@viron/lib';

  const adminUsers = await domainsAdminUser.list(conditions);
  ```

- 1件取得

  ```js
  import { domainsAdminUser } from '@viron/lib';

  const adminUser = await domainsAdminUser.findOneById(req.params.id);
  ```

- [x] AdminAccount

  Vironサーバーにログインしているユーザー自身を管理する機能を提供している。
  主にパスワード認証時のパスワード変更に利用する。

- 更新

  ```js
  import { domainsAdminAccount } from '@viron/lib';

  await domainsAdminUser.updateOneById(req.params.id, req.body);
  ```

- リスト取得(ログインユーザーのみなので必ず1件しかないが、Vironのテーブルスタイルで表示するためリスト形式で取得)

  ```js
  import { domainsAdminAccount } from '@viron/lib';

  const adminAccount = await domainsAdminAccount.listById(req.params.id);
  ```

- [x] AuditLog

  Vironの監査ログを記録する。
  - 記録
    - すべてのオペレーションで実施する
    - ヘルスチェックなどの記録不要なオペレーションは、OpenAPIに `x-skip-auditlog: true` を指定する
    - パスワードなどの機密情報を記録しないため、`format: password` フィールドは自動的にマスキングされる
      - それ以外の項目をマスキングしたい場合は自前で実装が必要

  ```js
  import { domainsAuditLog } from '@viron/lib';

  const log = {
    requestMethod: req.method,
    requestUri: req.path,
    sourceIp: req.socket.remoteAddress,
    userId: req.params.id,
    statusCode: res.statusCode
  };
  domainsAuditLog
    .createOneWithMasking(
      req.path,
      req.method,
      apiDefinition,
      log,
      req.body
    )
    .catch((e) => {
      console.warn('AuditLog create fail', e);
    });
  ```

- [x] x-enum

enumで生成されるセレクトボックスの内容を動的に生成したい場合に使う。

  ```yaml
  paths:
    /viron/resource_ids:
      get:
        operationId: listVironResourceIds
        responses:
          200:
            content:
              application/json:
                schema:
                  type: array
                  items:
                    type: string 
  components:
    schemas:
      VironAdminRolePermission:
        type: object
        properties:
          resourceId:
            type: string
            x-enum: # このoperationが返すリストがセレクトボックスに適用される
              operationId: listVironResourceIds
          permission:
            type: string
            enum:
              - read
              - write
              - all
              - delete
              - deny
  ```

- [x] x-autocomplete

  テキストボックスの内容を自動補完したい場合に使う。

  ```yaml
  info:
    x-autocomplete:
      responseLabelKey: label
      responseValueKey: value

  paths:
    /roles:
      get:
        operationId: listRoles
        parameters:
          - name: roleId
            in: query
            schema:
              type: string
        responses:
          200:
            content:
              application/json:
                schema:
                  type: array
                  items:
                    type: object
                    properties:
                      # .info["x-autocomplete"] に定義したプロパティで返す
                      label:
                        type: string
                      value:
                        type: string

  components:
    schemas:
      CreateUserPayload:
        type: object
        properties:
          name:
            type: string
          roleId:
            type: string
            x-autocomplete:
              operationId: listRoles
              defaultParametersValue:
                roleId: '${autocompleteValue}' # 入力中の値がパラメータに付加して送信される
  ```
