---
id: auth
title: Authentication
slug: /
---

- [ ] 401
- [ ] x-viron-authtypes-path
- [ ] providerとかtypeとか
- [ ] 最初の一人のID/passはなんでもOK
- [ ] 認証用cookieの設定について
  - SameSite属性
    - SameSite=None
    - 独自配信する場合の設定はSameSite=Strict
  - Secure属性
    - 指定し、https通信上のみでcookieがサーバに送信されるようにすること。
  - HttpOnly属性
    - 指定し、JavaScriptのDocument.cookie APIアクセスを不可にする。
  - Domain属性
    - 指定すると制限が緩和されるので、未指定にするのがベター。(未指定時はcookieを送信したサーバのオリジンがdomain値となる)
    - stg/prdなど環境別にoasを提供するケースにおいて、サブドメインで環境分けをしている場合はDomain属性値にそのサブドメインを指定する必要がある。(環境をまたいでcookieが送信されてしまうため)
  - Path属性
    - 基本的には/を指定すること。
    - (レアケースだと思うけど...)stg/prdなど環境別にoasを提供するケースにおいて、pathnameで環境分けをしている場合はpath属性値にそのpathnameを指定する必要がある。(環境をまたいでcookieが送信されてしまうため)
  - Expires属性とMax-Age属性
    - ご自由に。
- [ ] OAuthについて
![flow](https://camo.qiitausercontent.com/cbceb0f0e391aeeb9220c484838d0c13e730c75d/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e616d617a6f6e6177732e636f6d2f302f3130363034342f64393131396632312d373336642d643565642d393634642d3330363861663066636465392e706e67)
① アプリXYZ
ユーザがブラウザでviron.plusを開いている状態。
ユーザがエンドポイントを登録する。
401だったら、GET /authconfigsして[ authconfig(email), authconfig(signout), authconfig(oauth), authconfig(oauthcallback)  ]


② 認可エンドポイントへのリクエスト
authconfigの
{
  type: ‘oauth’,
  provider: ‘google’,
  pathObject: {
    get: {
      ‘/oauth’: { …. }
    }
  }
}
viron.plusから
GET /vrn.fensi.plus/oauth….?endpointId=xx&redirect_uri=https://viron.plus/oauthredirect
Response
  ここ飛べ: ://oauth.google.com/?response_type=code&client_id={クライアントID} // ※A
  header
    set-cookie: state:xxxx, endpointId:xxxx;
-------
viron.plusから
GET ://oauth.google.com/
  ?response_type=code            // 必須
  &client_id={クライアントID}      // 必須
  &redirect_uri={viron.plus/oauthredirect}  // 条件により必須
  &scope={スコープ群}              // 任意
  &state={任意文字列}              // 推奨
  &code_challenge={チャレンジ}     // 任意
  &code_challege_method={メソッド} // 任意
  HTTP/1.1
HOST: {認可サーバー}

(上記の※Aと一緒)

③④⑤ 認可画面で必要事項入力

⑥ アプリXYZにリダイレクトされる
Location: {viron.plus/oauthredirect}
  ?code={認可コード}        // 必須
  &state={任意文字列}       // 認可リクエストに state が含まれていれば必須

⑦ アプリXYZにリダイレクトされる
location.href: {viron.plus/oauthredirect?code={認可コード}&state={任意文字列}
を取得して、
authconfigの
{
  type: ‘oauthcallback’,
  provider: ‘google’,
  pathObject: {
    [method]: {
      ‘/oauthcallback’: { …. }
    }
  }
}
から
{vrn.fensi.plus/oauthcallback}?code={認可コード}&state={任意文字列}
request header
  cookie: state:xxxxx, endpointId: xxxxx;
を生成してリクエストを投げる。
i.e.
request先: {vrn.fensi.plus/oauthcallback}?code={認可コード}&state={任意文字列}
リファラ: viron.plus
response:
  body:
    endpointId
  header
    set-cookie: authToken=xxxxxxxx

vrn.fensi.plusサーバは上記リクエストを受け取ったときに、
認可コードとアクセストークンの交換をoauth.google.comと行う。取得したアクセストークンを基に、set-cookie値を生成してviron.plusへのレスポンスに含める。
