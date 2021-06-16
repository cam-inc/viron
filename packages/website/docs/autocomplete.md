---
id: autocomplete
title: Autocomplete
slug: /
---

Autocompleteについて。

```json
{
  openapi: '3.0.2',
  info: {
    'x-autocomplete': {// これね
      // <datalist><option value="{responseValueKeyプロパティ値}">{responseLabelKeyプロパティ値}</option></datalist>
      responseLabelKey: 'label',// オプション
      responseValueKey: 'value',// 必須
    }
  },
  paths: {
    '/followers': {// オートコンプリート使う側
      post: {
        operationId: 'postFollower',
        parameters: [],// requestBodyと同じのりで。
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',// リスト取得APIレスポンス配列の要素のresponseValueKey値と同一のtypeにすること。
                    'x-autocomplete': {
                      operationId: 'getAutocompleteUsers'// リスト取得APIのOperationIDを指定
                      defaultParametersValue: {
                        b: '${autocompleteValue}',
                        x: 111,
                      },
                      defaultRequestBodyValue?: any;
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/autocomplete/users': {// オートコンプリート用API
      get: {
        operationId: 'getAutocompleteUsers',
        parameters: [
          // '${autocompleteValue}'で受け取る用のparameterを必ず含めること。
          {
            name: 'b',
            in: 'query',// なんでもいいけど、普通はqueryでしょ。
            schema: {
              type: 'string',// /followersの'x-autocomplete'を指定しているプロパティと同一のtypeにすること。
            }
          },
          {
            name: 'x',
            in: 'query',
            schema: {
              type: 'number',
            }
          }
        ],
        requestBody: {
          // 多くの場合、parametersとしてクエリパラメータを受け取るはず。requestBodyで受け付けたい場合でもparamertersに書くのと同じのりで。
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',// 必ずarrayに。
                  items: {
                    type: 'object',
                    properties: {
                      // responseLabelKeyと同名のkey名。
                      label: {
                        type: 'string'
                      },
                      // responseValueKeyと同名のkey名。
                      value: {
                        type: 'string'// numberやbooleanｍの可能そうだけど、仕様ケースが思い浮かばないので今のとこstringのみを想定。
                      }
                    },
                    required: ['label', 'value']// responseLabelKeyとresponseValueKeyと同じ値を。
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
