---
title: Related Operations
---

[OAS Operation Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#operationObject)s are the **keystones** for the reason that Viron sends requests based heavily on them and each content in the Viron page relates to them.

## Three Types of Operation
Viron categorizes OAS operations into three types:
- `Base Operation`
- `Sibling Operation`
- `Descendant Operation`

The following sections describe each type using a sample OAS document below:

```json
{
  "openapi": "3.0.2",
  "info": {
    "x-pages": [
      {
        "id": "string",
        "contents": [
          {
            "type": "string",
            "operationId": "getUsers", // Base Operation
            "defaultParametersValue"?: { // optional default parameters paylod
              [key in string]: any
            };
            "defaultRequestBodyValue"?: any, // optional default request body paylod
            "actions"?: [// optional property to specify related operations
              {
                "operationId": "getCSVUsers",
                "defaultParametersValue"?: RequestParametersValue, // should meet the OAS Parameter Object specified
                "defaultRequestBodyValue"?: RequestRequestBodyValue // // should meet the OAS Request Body Object specified
              },
              {
                "operationId": "getCSVUser",
                "defaultParametersValue"?: RequestParametersValue,
                "defaultRequestBodyValue"?: RequestRequestBodyValue
              }
            ]
          }
        ]
      }
    ],
    "x-table"?: {
      "responseListKey": "list"
    };
  },
  "paths": {
    "/users": {
      "get": { // Base Operation
        "operationId": "getUsers",
        "responses": {
          "200": {
            "contetnt": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "list": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "userId": { ... }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": { // Sibling Operation
        "operationId": "postUsers"
      }
    },
    "/users/{userId}": {
      "get": { // Descendant Operation
        "operationId": "getUser"
      },
      "put": { // Descendant Operation
        "operationId": "putUser"
      },
      "delete": { // Descendant Operation
        "operationId": "deleteUser"
      }
    },
    "/csv/users": {
      "get": { // Sibling Operation
        "operationId": "getCSVUsers",
        "parameters": [
          {
            "name": "foo",
            "in": "string"
          }
        ]
      }
    },
    "/csv/users/{userId}": {
      "get": { // Descendant Operation
        "operationId": "getCSVUser",
        "parameters": [
          {
            "name": "userId",
            "in": "string"
          }
        ]
      }
    }
  }
}
```

## Base Operation
**Base operations** are the ones that are specified in the Viron content with the property of `operationId`. Viron uses them to display some data on the Viron endpoint page. As the name implies, they are the **origins** of all `sibling` and `descendant` operations.

Interpreting an OAS document, Viron searches for the [OAS Operation Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#operationObject) that matches the `operationId` specified, uses the found one as a `base operation`, and sends requests with payloads according to what the base operation defines. In the sample OAS document above, `getUsers` is a base operation.

The optional `defaultParametersValue` and `defaultRequestBodyValue` properties are data that meet the [OAS Parameter Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#parameterObject) and [OAS Request Body Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#requestBodyObject) specified in a base operation. Those values play as **default overwritable values** when Viron sends GET requests.

## Sibling Operation
**Sibling operations** are siblings of a particular `base operation`. They are request-sendable operations for Viron through designate UIs. For example, an operation of `POST /users` would be a sibling of a base operation of `GET /users`. Sibling operations should meet the conditions:
- The operation's request `method` **should not** be the same as the base operation's.
- The [OAS Path Item Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#path-item-object) that includes the operation **should** have the same `pathname` as the base operation's.
- Operations specified in the Viron content's `actions` property are sibling operations as long as their request payload key set **does not** contain one of the base operation's response payload keys.

The sibling operations in the sample OAS document are `postUsers` and `getCSVUsers`.

Sibling operations use the `defaultParametersValue` and `defaultRequestBodyValue` properties specified by content in the `actions` property and the ones of the base operation's.

## Descendant Operation
**Descendant operations** are children of a particular base operation. They are request-sendable for Viron through designate UIs.  For example, operations of `PUT /users/{userId}` and `DELETE /users/{userId}` would be descendants of a base operation of `GET /users`. Descendant operations **should** meet the conditions:
- The [OAS Path Item Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#path-item-object) that includes the operation **should** include the `pathname` of the base operation's one **at the head**. (i.e. `/{base operation's pathname}/xxx/yyy`)
- Operations specified in the Viron content's `actions` property are descendant operations as long as their request payload key set **does** contain one of the base operation's response payload keys.

The descendant operations in the sample OAS document are `getUser`, `putUser`, `deleteUser`, and `getCSVUser`.

Some Viron content types **may** affect whether an operation is treated as a descendant operation. For example, contents of the type `number` do not have any descendant operation.

Descendant operations use the `defaultParametersValue` and `defaultRequestBodyValue` properties specified by content in the `actions` property, the ones of the base operation's, and some data of the base operation's response.
