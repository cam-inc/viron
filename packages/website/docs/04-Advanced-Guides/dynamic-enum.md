---
title: Dynamic Enum
---

Schema拡張の`x-enum`のこと。通常はenumプロパティとして固定配列を定義するが、x-enumを使うと動的に配列を取得できる。

```json
"category": {
  "type": "string",
  "x-enum": {
    "operationId": "get:/enum",// 通信先を指定。
    "defaultParametersValue": {// Operationのparamters内容に対して過不足なく定義すること。(ユーザ入力後に通信しないので。)
      "aa": "AA"
    }
  }
}
```

```json
"/enum": {
  "get": {
    "operationId": "get:/enum",
    "parameters": [// 'x-enum'のdefaultParametersValue内容に対して過不足なく定義すること。
      {
        "name": "aa",
        "in": "query",
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "description",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",// 必ず配列にすること。
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
}
```
