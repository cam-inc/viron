---
title: Authentication
---

このページでは、Vironがエンドポイントとどのように連携してユーザーを認証するかを説明します。

## Public and Private

エンドポイントは**public**または**private**にすることができます。公開エンドポイントは誰でもアクセスでき、ユーザーを認証する必要はありません。例えば、[Guides](/docs/Guides/your-first-endpoint)のために作成したエンドポイントはパブリックです。一方、プライベートエンドポイントは認証されたユーザーのみがアクセスできます。パブリックエンドポイントとプライベートエンドポイントの違いは、エンドポイントが認証するかしないかです。

## What Viron Does

Viron sends a `GET` request to the endpoint's URL with `cookies` that have been previously set by the endpoint and waits for a response to come. When the response's status code is `200`, Viron treats the user as authenticated. When `401`, Viron refers to the custom response header `x-viron-authtypes-path` to send another request to the endpoint to know how to prompt the user to get authenticated. Then, Viron sends a request with payloads that the user has input to the endpoint and expects the response to include the `set-cookie` response header so Viron can send subsequent requests with the cookies.

## The `x-viron-authtypes-path` custom response header

This custom response header **should** be a part of the responses from the endpoint, and its value **should** be of URL `pathname`. Viron sends a request to the URL and expects the response body to be a JSON object with an authentication type `list` and an `OAS document`.

The response header of `GET /oas`:

```text
x-viron-authtypes-path: /authentication
```

The response body of `GET /authentication`:

```json
{
  "list": [
    // a list of authentication types
  ],
  "oas": {
    // an OAS document
  }
}
```

## Authentication Types

There are four types of authentication: `email`, `oauth`, `oauthcallback`, `oidc`, `oidccallback`, and `signout`. Each authentication has a schema of this:

```json
{
  "type": "email" | "oauth" | "oauthcallback" | "oidc" | "oidccallback" | "signout";
  "provider": string;
  "operatioId": string; // Used to determine how to send a request.
  "mode"?: 'navigate' | 'cors'; // Used to determine the method of opening the authentication endpoint. Only applicable if type is 'oidc' or 'oauth'.
  "defaultParametersValue"?: any;
  "defaultRequestBodyValue"?: any;
}
```

:::tip
基本的には`mode: 'cors'`とします。
ただし、vironをセルフホストしている場合は、どのモードを選んでもかまいません。

### `email`

When this type of authentication is specified, Viron prompts users to enter fields like `email` and `password` to get authenticated. The endpoint **should** return a response with a cookie set.

```json
{
  "list": [
    {
      "type": "email",
      "operationId": "signinEmail"
    }
  ],
  "oas": {
    "openapi": "3.0.2",
    "info": {
      "title": "Authentication",
      "version": "1.0.0"
    },
    "paths": {
      "/email/signin": {
        "post": {
          "operationId": "signinEmail", // Should match the one specified in the list.
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["email", "password"],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email"
                    },
                    "password": {
                      "type": "string",
                      "format": "password"
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

### `oauth` and `oauthcallback`

Those types of authentication are for [the Authorization Code Grant of the OAuth 2.0 authorization framework](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1).

```json
{
  "list": [
    {
      "type": "oauth",
      "operationId": "signinOAuth",
      "mode": "cors",
      "defaultParametersValue": {
        "redirectUri": "${oauthRedirectURI}" // An environmental variable
      }
    },
    {
      "type": "oauthcallback",
      "operationId": "signinOAuthCallback",
      "defaultRequestBodyValue": {
        "redirectUri": "${oauthRedirectURI}" // An environmental variable
      }
    }
  ],
  "oas": {
    "openapi": "3.0.2",
    "info": {
      "title": "Authentication",
      "version": "1.0.0"
    },
    "paths": {
      "/oauth/signin": {
        "get": {
          "operationId": "signinOAuth", // Should match the one specified in the list.
          "parameters": [
            {
              "in": "query",
              "name": "redirectUri",
              "required": "true",
              "schema": {
                "type": "string",
                "format": "uri"
              }
            }
          ],
          "responses": {
            "301": {
              "description": "Redirect to the authorization endpoint."
            }
          }
        }
      },
      "/oauth/signin/callback": {
        "post": {
          "operationId": "signinOAuthCallback", // Should match the one specified in the list.
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["code"],
                  "properties": {
                    "code": { // Authorization code
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
```

Viron directs the user to the authorization endpoint with a parameter of RedirectURI, whose default value is an [environmental variable](/docs/Advanced-Guides/environmental-variable). After successfully granted, the user will be redirected back to Viron with an `authorization code`. Then, Viron sends another request with the authorization code to the endpoint, expecting the response to set a cookie.

### `oidc` and `oidccallback`

Those types of authentication are for [the Authorization Code Flow of the OpenID Connect protocol](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)

```json
{
  "list": [
    {
      "type": "oidc",
      "operationId": "signinOidc",
      "mode": "cors",
      "defaultParametersValue": {
        "redirectUri": "${oidcRedirectURI}" // An environmental variable
      }
    },
    {
      "type": "oidccallback",
      "operationId": "signinOidcCallback",
      "defaultRequestBodyValue": {
        "redirectUri": "${oidcRedirectURI}" // An environmental variable
      }
    }
  ],
  "oas": {
    "openapi": "3.0.2",
    "info": {
      "title": "Authentication",
      "version": "1.0.0"
    },
    "paths": {
      "/oidc/signin": {
        "get": {
          "operationId": "signinOidc", // Should match the one specified in the list.
          "parameters": [
            {
              "in": "query",
              "name": "redirectUri",
              "required": "true",
              "schema": {
                "type": "string",
                "format": "uri"
              }
            }
          ],
          "responses": {
            "301": {
              "description": "Redirect to the authorization endpoint."
            }
          }
        }
      },
      "/oidc/signin/callback": {
        "post": {
          "operationId": "signinOidcCallback", // Should match the one specified in the list.
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["code"],
                  "properties": {
                    "code": { // Authorization code
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
```

Viron directs the user to the authorization endpoint with a parameter of RedirectURI, whose default value is an [environmental variable](/docs/Advanced-Guides/environmental-variable). After successfully granted, the user will be redirected back to Viron with an `authorization code`. Then, Viron sends another request with the authorization code to the endpoint, expecting the response to set a cookie.

### `signout`

Use this type of authentication to `revoke` the cookie that has been set previously.

```json
{
  "list": [
    {
      "type": "signout",
      "operationId": "signout"
    }
  ],
  "oas": {
    "openapi": "3.0.2",
    "info": {
      "title": "Authentication",
      "version": "1.0.0"
    },
    "paths": {
      "/signout": {
        "post": {
          "operationId": "signout" // Should match the one specified in the list.
        }
      }
    }
  }
}
```

## Cookie

Below are recommended cookie attributes.

| attribute | |
| ---- | ---- |
| SameSite | `None`. `Strict` if self-hosted. |
| Secure | `enabled` |
| HttpOnly | `enabled` |
| Domain | `omitted`. If your endpoints share the same domain but use different subdomains, specify this attribute accordingly. |
| Path | `/`. If your endpoints share the same domain but use different pathnames, specify this attribute accordingly. |
| Expire | as you like. |
| Max-Age | as you like. |
| Partitioned | `enabled`. `disabled` if self-hosted. |
