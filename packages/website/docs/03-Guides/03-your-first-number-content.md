---
title: Your First Number Content
---

Viron `Content` is a page child, serving mainly as a monitor to display an assigned operation's response data. A page can have multiple contents inside.

## Editing the OAS Document

Edit the example response body of the request `GET /oas` as follows:

```json {11-17,26-28,31-52}
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
        "contents": []
      }
    ],
    "x-number": {
      "responseKey": "value"
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
    }
  }
}
```

Here we have added:
- a Viron content to display the number of DAU on the page named `Page One`.
- an [OAS Path Item Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#pathItemObject) that defines how to fetch the DAU data.

The OAS document now says that the Viron content on the page should display the DAU number fetched by the operation named `getDAU`. Viron interprets the information and works accordingly.

## Creating a New Request and Example Response
As Viron will try to send requests to fetch data in the way specified in the OAS document, we need to set up the `Postman mock server` to handle the requests. Create one with the data below:

For **Request**:

| | value |
| ---- | ---- |
| Name | `/dau` |
| Method | `GET` |
| URL | `{{url}}/dau` |

For **Example Response**,

**Content Type**: JSON

**Body**:
```json
{
  "value": 12345
}
```

**Response Headers**:

| key | value |
| ---- | ---- |
| access-control-allow-origin | `https://viron.plus` |
| access-control-allow-credentials | `true` |

Visit the Viron endpoint page and refresh, and you will see the DAU number.

:::note
Visit documentations for [content](/docs/Advanced-Guides/contet) and [content-number](/docs/Advanced-Guides/content-number) for detail.
:::
