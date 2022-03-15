---
title: Introduction
---

## Vironとは

Vironは**webベース**の運用管理サポートツールです。

- is based on and leverages **[OpenAPI Specification](https://oai.github.io/Documentation/)**,
- offers **Frontend-Node** console with **fine-tuned GUI**,
- and is an **Open-Source Software**.

Viron enables you to eliminate all the Frontend-matter tasks when administrating your API servers.

## The Idea

OpenAPI Specification, a.k.a. `OAS`, is a `YAML` or `JSON` file that defines an interface to a set of **RESTful** APIs. By interpreting an OAS document, the readers understand things such as:

- The overall idea for the APIs.
- How to call a particular API.
- How to construct request payloads.
- What type of schema do the APIs return.
- The ways to authenticate.
- And much more.

Viron evaluates and leverages OAS documents, interprets those above, and then constructs a **GUI** for you.

For example, if you provide an OAS document like this:

```json
// A Path Object, part of an OAS document.
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

Viron figures out how to communicate your RESTful API server; Viron fetches data by sending a `GET` request to `/users` with `query parameters` of `page` and `size` of type `integer`, expects to receive a `200` response of type `object` with a `list of users` and `pagination information` inside. The GUI Viron constructs would be a set of UI forms of:

- `<input type="number" />` for the `page` query parameter,
- `<input type="number" />` for the `size` query parameter,
- and a button to `submit`.

## In a Nut Shell

Provide Viron with an OAS document that defines your RESTful API server to get a fine-tuned GUI and save time. Focus on the product code of your service, not on the administration code. Time is crucial.

## Viron is For Those Who:

- have a `RESTful` administration API server.
- do not have time to make an administration website `from scratch`.
- have good knowledge of OpenAPI Specification.

## Viron is NOT For Those Who:

- require a complex administration website that an OAS document `can not define`.
- have a GraphQL administration API server.

## The Casts of Characters and Terminologies

There are three types of casts: **Viron user**, **Viron**, and **Viron administrator**

### Viron user

The definition for Viron users is anyone who communicates with administration API servers through the Viron-generated GUI screen. For example, team members in your project.

### Viron

Viron means a web-based GUI screen through which Viron users send requests and receive data from API servers. Viron is equivalent to an administration website that your team may have now.

### Viron administrator

If you are the one who administrates a RESTful API server and provides Viron with an OAS document, you are a Viron administrator.

## Features

### Frontend-NoCode

You do not need to write any frontend-matter codes. Instead, it is Viron who provides a GUI for your RESTful API server.

### Open-Source Software

Viron is open-source software that grants anyone to edit, study, distribute and contribute.

### Fine-Tuned User Interface

Viron works on all modern browsers offering **responsive UI**. In addition, it supports **light and dark modes** with pre-defined color themes.

### OpenAPI Specification-driven

What an OAS document can describe is what Viron can handle. Viron grows as OAS does.

### Secure

You can secure your OAS document by configuring authentication rules. You can also self-host Viron on any static file server to improve security.
