---
id: oas_info_extended
title: Extended Info Object
slug: /
---

OASのInfoオブジェクトに対する、Viron拡張箇所について。

- [ ] x-thumbnail
- [ ] x-theme
 - [ ] Light / Dark Modeについて
- [ ] x-tags

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
   - [ ] requestSizeKey
   - [ ] responseMaxpageKey
   - [ ] responsePageKey
 - [ ] sort
  - [ ] requestKey
  - [ ] schema.typeがarrayであること。
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
      'requestKey': 'sort'; // 「'sort': '${keyA}:asc,${keyB}:desc,${keyC}:desc'」の値の構造はキメ。
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
      parameters: [
        {
          name: 'sort',// info['x-table'].sort.requestKeyと同じ値に。
          in: 'query',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['id:asc', 'name:desc']をstyleに通したもの
          } | {
            type: 'object',
            properties: {// sort対象のkey群。
              id: {
                type: 'string'
                enum: ['asc', 'desc']
              },
              name {
                type: 'string',
                enum: ['asc', 'desc']
              }
            },
            example: {
              id: 'asc',
              name: 'desc'
            }をstyleに通したもの
          } | {
            type: 'string',
            example: 'id:asc,name:desc'をstyleに通したもの
          }
        },
        {
          name: 'page',// info['x-table'].pager.requestPageKeyと同じ値に。
          in: 'query',
          schema: {
            type: 'number' | 'integer',
          }
        },
        {
          name: 'size',// info['x-table'].pager.requestSizeKeyと同じ値に。
          in: 'query',
          schema: {
            type: 'number' | 'integer',
          }
        }
      ],
      requestBody: {
        // parametersと同様の決まりなら、代わりにここに書いてもよい。
      },
      response: {
        200.content.application/json: {
          schema: {
            type: 'object',
            properties: {
              list: {// info['x-table'].responseListKeyと同じ値に。
                type: 'array',
                items: {
                  type: 'object'// ここは絶対objectね
                  properties: {
                    ご自由に。 keyがテーブルcolumnになる。valueが各rowのcellになる。
                  }
                }
              },
              maxpage: {// info['x-table'].pager.responseMaxpageKeyと同じ値に。
                type: 'number'
              },
              page: {// info['x-table'].pager.responsePageKeyと同じ値に。
                type: 'number'
              }
            }
          }
        }
      }
    }
  }
}
```
