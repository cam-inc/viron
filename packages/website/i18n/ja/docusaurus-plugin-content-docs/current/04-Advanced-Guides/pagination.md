---
title: Pagination
---

A long list can be divided into several pages using this function, and only a single page will be displayed at a time.


## Setting for each Viron Content
The `Pagination` function can be enabled per each Viron content. To make a Viron content, mark it like this:

```json {6}
// Content Object
{
  "title": "Table content with the pagination function",
  "type": "table",
  "operationId": "fetchUsers",
  "pagination": true
}
```

## Setting for all Viron Contents
You also need to provide Viron with general information related to this function. This information will be **shared among all the Viron contents of the same content type** with the pagination function enabled. Currently, only table-type contents support the Pagination function.

```json {5,7-12}
// Info Object
{
  "x-table": {
    // The values should match the one of Response Object.
    "responseListKey": "list",
    // Should be present.
    "pager": {
      "requestPageKey": "page",
      "requestSizeKey": "size",
      "responseMaxpageKey": "maxPage",
      "responsePageKey": "currentPage"
    }
  }
}
```

## Path Item Object
Related Path Item Objects should follow what an OAS document defines for the Pagination function.

```json {5,9,17,32,37,41}
// Path Item Object
{
  "/users": {
    "get": {
      "operationId": "fetchUsers",
      "parameters": [
        {
          // Should be the same as `requestSizeKey`
          "name": "size",
          "in": "query",
          "schema": {
            "type": "integer"
          }
        },
        {
          // Should be the same as `requestPageKey`
          "name": "page",
          "in": "query",
          "schema": {
            "type": "integer"
          }
        }
      ],
      "responses": {
        "200": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  // Should be the same as `responseListKey`
                  "list": {
                    "type": "array",
                    "items": { ... }
                  },
                  // Should be the same as `responsePageKey`
                  "currentPage": {
                    "type": "integer"
                  },
                  // Should be the same as `responseMaxpageKey`
                  "maxPage": {
                    "type": "integer"
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
