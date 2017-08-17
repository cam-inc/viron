# 機能

DMCを使う上で必須の機能について説明します。  
これらの機能はほとんどの実装が `node-dmclib` として別ライブラリに切り出されていますが、  
サービス側で実装する必要がある部分があるので、それらも合わせて記述します。  

## 認証・認可

GoogleOAuth2、または自前のメアド/passwordでの認証を行いJWTを発行します。  
その際に管理権限を参照して認可情報をトークンに埋め込んでいます。  
以降のAPIリクエストは都度ヘッダに渡されるJWTをデコードして認可情報を取り出し、権限の有無を確認しています。  

`api/controllers/dmc_auth.js` : node-dmclibに実装されたcontrollerを利用可能です。  
`api/controllers/dmc_authtype.js` : サーバがサポートしている認証方式をクライアント側に伝えるためのAPIです。  

## 管理ユーザー管理

DMC利用者を管理するための機能です。  
Google認証の場合、初回ログイン時に自動的に管理ユーザーが作成されます。  
その際、configに記述したデフォルトロールが割り当てられるので、システム管理者は適宜変更してください。  
メアド認証の場合、事前にシステム管理者が管理ユーザーを作成しておく必要があります。  

`api/controllers/dmc_admin_user.js` : node-dmclibに実装されたcontrollerを利用可能です。  

## 管理権限管理

DMC利用者に対して操作権限を設定するための機能です。  
リソースに対してGET/POST/PUT/DELETEが可能かという単位で権限の設定ができます。  
システム管理者は管理ユーザーに対して適切に権限を付与する必要があります。  
また、管理権限自体の管理もDMCで行うため、管理権限を操作するための権限の設定には注意が必要です。  

`api/controllers/dmc_admin_role.js` : node-dmclibに実装されたcontrollerを利用可能です。  

## 監査ログ

DMCを操作した履歴が蓄積されます。  

`api/controllers/middlewares.js` : 監査ログを書き込む機能をmiddlewareとして提供しています。  
`api/controllers/dmc_audit_log.js` : 監査ログを参照するAPIです。node-dmclibに実装されたcontrollerを利用可能です。  

## CRUD

基本的なCRUDであればnode-dmclibが提供するStoreHelperを用いて簡単に実装できます。  
`api/controllers/user.js` などを参考にしてください。  

## CORS

DMCはjsの配信とAPIサーバが別ドメインになるためCORSの対応が必須になります。  
node-dmclibは必要なヘッダを付加するmiddlewareを提供しているため、configに設定を書くだけでCORSの対応が可能です。  
