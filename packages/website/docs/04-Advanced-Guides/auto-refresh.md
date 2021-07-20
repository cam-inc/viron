---
title: Auto refresh
---

自動更新機能について。

```json
{
  openapi: '3.0.2',
  info: {
    'x-pages': [
      {
        id: string;
        contents: [
          {
            operationId: OpeartionId;
            autoRefreshSec: number; // ここに自動更新機能のインターバル秒数を！
          }
        ]
      }
    ]
  },
}
```
