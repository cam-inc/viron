---
id: oas_info_extended
title: Extended Info Object
slug: /
---

OASのInfoオブジェクトに対する、Viron拡張箇所について。

- [ ] x-pagesについて
 - [ ] id
 - [ ] title
 - [ ] description
 - [ ] group
 - [ ] contents

- [ ] 各コンテンツについて(i.e. Info['x-pages'].contents[n])
 - [ ] title
 - [ ] type
 - [ ] operationId
 - [ ] defaultParametersValues
 - [ ] defaultRequestBodyValues

- [ ] x-tableについて
 - [ ] responseListKey
 - [ ] pager
   - [ ] requestPageKey
   - [ ] requestPageKey
   - [ ] responseMaxpageKey
   - [ ] responsePageKey
 - [ ] sort
  - [ ] requestKey
  - [ ] 値が'${keyA}:asc,${keyB}:desc,${keyC}:desc'の固定形式であること


メモ
```json
info: {
  'x-table': {// styleがtableであるcontentの補助機能について
    'responseListKey': 'list'// レスポンスのどのkeyが一覧データであるか
    pager: {// 'pagerXxx' ぺージャー機能について
      'requestPageKey': 'page';
      'requestSizeKey': 'size';
      'responseMaxpageKey': 'maxpage';
      'responsePageKey': 'page';
    },
    sort; {// 'sortXxx' ソート機能について
      'requestKey': 'sort'; // 「'sort': '${keyA}:asc,${keyB}:desc,${keyC}:desc'」の値の構造はキメ。v
    }
  };
  'x-pages': [
    {
      contents: [
        {
          operationId: 'listUsers';// どのOperationに該当するかの印。
          style: 'table';// info['x-{style}']も考慮してね
          defaultParametersValues: {
            [key in string]: any;
          };// Operationに沿ったデータにしてね // pagerのsizeとかpage値がここに含まれるはず。
          defaultRequestBodyValues: any;// Operationに沿ったデータにしてね
        }
      ]
    }
  ]
}
paths: {
  '/users': {
    get: {
      operationId: 'listUsers',
      parameters: [],
      requestBody: {},
      response: {

      }
    }
  }
}
```
