# swagger

ここではDMCにおけるswaggerの記述について説明します。  
swaggerの基本仕様は [公式ドキュメント](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) を参照してください。  

# Schema

Swaggerオブジェクトの各フィールドについて説明します。  
ここに説明がある項目はすべて必須になります。  

## swagger

swaggerのバージョンを記述するフィールドです。  
DMCでは `2.0` 固定です。  

## host

APIを提供するホストを記述します。  
サーバを起動する際にここに記述されたポートでlistenします。  
（環境変数PORTによる上書きが可能）  

## info

API全般についてのメタ情報を記述します。  
titleやdescriptionはブラウザでエンドポイント追加した際にカードに表示される項目です。  

## schemes

APIが利用する転送プロトコルの一覧です。  
基本的には `https` のみで問題ありません。  

## definitions

pathsに定義するOperationによって要求(リクエスト)または応答(レスポンス)されるデータ型をJSON-Schemaで記述します。  
swagger2.0がサポートしているのは [JSON-Schema Draft4](http://json-schema.org/specification-links.html#draft-4) というバージョンです。  
最新版ではないので注意が必要です。  

descriptionやexampleは省略可能な項目ですが、書いておくと画面に表示されるためユーザビリティが上がります。  

valiationやformatはクライアント側でUIの出し分けに使われるのでできるだけ書いたほうが良いです。  
example-nodeのswagger.yamlの `definitions.Validator` や `definitions.Format` を参考にしてください。  

## paths

APIの定義を記述します。  
SwaggerExpressやDMC固有の仕様について説明します。  

`x-swagger-router-controller` : SwaggerExpressがルーティングに使用するフィールドです。 `api/controllers` 配下のjsファイル名に一致させます。  

`operationId` : SwaggerExpressがルーティングに使用するフィールドです。Controllerのjsファイルがexportするキーに一致させます。  

`security` : 後述の `securityDefinitions` に定義した認証スキームを使用するOperationに設定します。  
　この記述があれば認証必須、なければ非認証でもコールできるという意味になります。  

`x-ref` : Operation間の関連付けがある場合に使用します。  
　pathsフィールドはパスベースでOperationを定義するため、  
　基本的なCRUDのREST API設計(GET:/user, POST:/user, PUT:/user/:id, DELETE:/user/:id)をした際に  
　`/user` と `/user/:id` が同じリソースを扱うAPIだと判断することができません。  
　`x-ref` はこの問題を解決するために強制的にOperation間の関連付けを定義する拡張です。  
　`appendTo` フィールドは、リソース全体を操作するOperationなのか、1件のみを操作するOperationなのかを記述します。  

## securityDefinitions

認証スキームを定義するフィールドです。  
DMCはGoogleOAuth2かID/passによるJWT認証のみをサポートしています。  

## produces

APIが提供するMIMEタイプの一覧です。  
Operation側で定義を上書きすることもできますが、よく使うMIMEタイプはここに書いておくと良いです。  

## consumes

APIが受け付けるMIMEタイプの一覧です。  
Operation側で定義を上書きすることもできますが、よく使うMIMEタイプはここに書いておくと良いです。  

