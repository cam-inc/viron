---
id: related_operations
title: Related Operations
slug: /
---

各Contentにおける関連Operationについて。

```json
{
  openapi: '3.0.2',
  info: {
    'x-pages': [
      {
        id: string;
        contents: [
          {
            type: string;
            operationId: 'getUsers';// ベースOperationId
            defaultParametersValue?: {
              [key in string]: any;
            };
            defaultRequestBodyValue?: any;
            actions?: [// ベースOperationとは直接関連の無いOperationを明示的に関連Operationとして指定する為のプロパティ。
              {
                operationId: 'getCSVUsers';
                defaultParametersValue?: RequestParametersValue;
                defaultRequestBodyValue?: RequestRequestBodyValue;
              },
              {
                operationId: 'getCSVUser';
                defaultParametersValue?: RequestParametersValue;
                defaultRequestBodyValue?: RequestRequestBodyValue;
              }
            ];
          }
        ]
      }
    ],
    'x-table'?: {
      responseListKey: 'list'
    };
  },
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        responses: {
          200: {
            contetnt: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    list: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          userId: { ... }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        operationId: 'postUsers'
      }
    },
    '/users/{userId}': {
      get: {
        operationId: 'getUser'
      },
      put: {
        operationId: 'putUser'
      },
      delete: {
        operationId: 'deleteUser'
      }
    },
    '/csv/users': {
      get: {
        operationId: 'getCSVUsers'
        parameters: [
          {
            name: 'foo',
            in: string;
          }
        ]
      },
    },
    '/csv/users/{userId}': {
      get: {
        operationId: 'getCSVUser',
        parameters: [
          {
            name: 'userId',
            in: string;
          }
        ]
      },
    },
  }
}
```

## Related Operations

ベースOperationに関連するOperationのこと。
ベースOperationとpathが同じでmethodが違うすべてのOperationが対象。
- `postUsers`
actionsに指定したOperationのうち、そのOperationのparametersの中にベースOperationのresponse(typeがtableならresponse[Info['x-table'].responseListKey])内のkeyと同じkeyが一つも存在しない場合、それはRelated Operationの対象となる。
 - `getCSVUsers`

## Related Descendants Operations

ベースOperationの子孫っぽく関連するOperationのこと。
ベースOperationがtable(content.typeがtable)の場合、tableの各rowに関連するであろうOperation。
ベースOperationのpath配下の全てのOperationが対象。(`${baseOparerion.path}/xxx/yyy/zzz`に該当する全メソッドのOperation)
 - `getUser`
 - `putUser`
 - `deleteUser`
actionsに指定したOperationのうち、そのOperationのparametersの中に一つでもベースOperationのresponse(typeがtableならresponse[Info['x-table'].responseListKey])内のkeyと同じkeyが存在する場合、それはRelated Descendants Operationの対象となる。
 - `getCSVUser`

contentのtypeに応じて対象となるOperationに若干の差異がある。例えば、content.typeがnumberの時はRelated Descendants Operationが存在しないはず。

## Operationのpayloadについて

ベースOperationのpayloadは、ユーザ入力値に加えて、defaultParametersValueとdefaultRequestBodyValue(`Info['x-pages'][number]['contents'][number].defaultXXXValue`)も使用される。

Related Operationのpayloadは、ユーザ入力値に加えて、ベースOperationと同じdefaultParametersValueとdefaultRequestBodyValueも使用される。

Related Descendants Operationのpayloadは、ユーザ入力値に加えて、ベースOperationと同じdefaultParametersValueとdefaultRequestBodyValue、更にベースOperationレスポンスの一部が用いられる。(content.typeがtableの場合は各rowに該当するデータ)
Related Descendants Operationのparametersはreadonlyとなり、ユーザ入力を受け付けない。
