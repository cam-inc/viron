---
title: Environmental Variable
---

defaultParametersValueに使用できるViron環境変数。

`"${環境変数名}"`の形。

```json
"defaultParametersValue": {
  "flexible": "${autocompleteValue}",
}
```

って書くと、

```json
"defaultParametersValue": {
  "flexible": "xxx",
}
```

のように、値が置換される。

一覧。
- `${autocompleteValue}`
- `${oauthRedirectURL}`
