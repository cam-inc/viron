---
title: Your First Table Content
---

Viron contents of type `table` are suitable for such data containing an array of children of **consistent schema**.

## Editing the OAS Document
Edit the example response body of the request `GET /oas` as follows:

```json {23-29,35-37,62-94}
{
  "openapi": "3.0.2",
  "info":{
    "title": "RESTful Administration API Server for Viron",
    "version": "mock",
    "x-pages": [
      {
        "id": "page01",
        "title": "Page One",
        "group": "sample",
        "contents": [
          {
            "type": "number",
            "title": "My First Number Content",
            "operationId": "getDAU"
          }
        ]
      },
      {
        "id": "page02",
        "title": "Page Two",
        "group": "sample",
        "contents": [
          {
            "type": "table",
            "title": "My First Table Content",
            "operationId": "getUsers"
          }
        ]
      }
    ],
    "x-number": {
      "responseKey": "value"
    },
    "x-table": {
      "responseListKey": "list"
    }
  },
  "paths": {
    "/dau": {
      "get": {
        "operationId": "getDAU",
        "responses": {
          "200": {
            "description": "Daily Active User",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users": {
      "get": {
        "operationId": "getUsers",
        "responses": {
          "200": {
            "description": "User List",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "list": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string"
                          },
                          "name": {
                            "type": "string"
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
      }
    }
  }
}
```

Here we have added:
- a Viron content to display the **table** data of `users` on the page named `Page Two`.
- an [OAS Path Item Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#pathItemObject) that **defines how to fetch** the users' data.

The OAS document now says that Viron should fetch users' data by the operation named `getUsers` and display it in a **table**. Viron interprets the information and does so **with some functions** suitable for table UI.

## Creating a New Request and Example Response
As Viron will try to send requests to fetch data in the way specified in the OAS document, we need to set up the `Postman mock server` to handle the requests. Create one with the data below:

For **Request**:

| | value |
| ---- | ---- |
| Name | `/users` |
| Method | `GET` |
| URL | `{{url}}/users` |

For **Example Response**,

**Name**: `Default`

**Content Type**: `JSON`

**Body**:
```json
{
  "list": [
    {
      "id": "001",
      "name": "Cool Name"
    },
    {
      "id": "002",
      "name": "Cute Name"
    },
    {
      "id": "003",
      "name": "Fancy Name"
    }
  ]
}
```

**Response Headers**:

| key | value |
| ---- | ---- |
| access-control-allow-origin | `https://viron.plus` |
| access-control-allow-credentials | `true` |

Visit the Viron endpoint page and select `Page Two`, and you will see the users' table.

:::note
Visit documentations for [content](/docs/Advanced-Guides/contet) and [content-table](/docs/Advanced-Guides/content-table) for detail.
:::
