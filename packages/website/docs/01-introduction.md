---
title: Introduction
---

# Welcome to Viron

## What is Viron

Viron is an [OpenAPI Specification](https://oai.github.io/Documentation/)-based administration web service that allows you to administrate any kinds of service you own.
It provides you with Frontend-NoCode GUI. All you need to do is just to let Viron fetch your OpenAPI document. You don't need to consume engineers' crucial person-hours anymore for just constructing an administration web service which is not the main target you would let them work on.

## The Idea

OpenAPI Specification (a.k.a OAS) is a YAML or JSON file that defines an interface to a set of RESTful APIs. Using an OAS document, you and computers know
- What the service is like.
- Where to send requests.
- How to construct request payloads.
- etc.

**Viron leverages the OAS.** By reading an OAS document meticulously, Viron understands how to consume and interact with the service the document defines. For example, if an OAS document tells Viron about how to fetch a list of users providing with the snippet below,

```json
{
  "/users": {
    "get": {
      "summary": "Returns a list of users.",
      "parameters": [
        {
          "name": "page",
          "in": "query",
          "schema": {
            "type": "integer"
          }
        },
        {
          "name": "size",
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
                  "list": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        },
                        "name: {
                          "type": "string"
                        }
                      }
                    }
                  },
                  "page": {
                    "type": "integer"
                  },
                  "maxpage": {
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

Viron can fetch data by sending a `GET` request to `/users` with `query parameters` of `page` and `size` of type `integer` and expect to receive a `200` response of type `object` containing a `list` of users and pagination information from the `page` and `maxpage` properties.

At this point, Viron can **construct a GUI** whose function is to do the task above.

## In a Nut Shell

No more creating an administration GUI, but just **provide Viron with an OAS document** that defines your service so that **Viron provides you with a GUI** that is all dedicated to your service.

## Who Viron is for

Our target consumers are

- 管理画面に工数を使いたくない人。
- シンプルな管理画面を求めている人。

## Who Viron is NOT for

Out of our target are consumers who

- 複雑な管理画面を求めているひと。

## Features

Some of notable featrues are:

### Frontend-NoCode

### Open Source Software

### Fine-Tuned User Interface

### OpenAPI Specification-driven

### Secure
