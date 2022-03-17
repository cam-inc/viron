---
title: Your First Endpoint
---

As the first step of our guide, we walk you through how Viron works and handle an OAS document by setting up a simple **mock** RESTful API server.

:::note
It is up to you how the actual RESTful API server is set up as long as the server meets Viron's requirements.
:::

## Preparation
As we use [Postman](https://www.postman.com/)'s [Mock Server function](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) for our guide, you **need to create your Postman account before reading on**. Here are some links that would help you understand what Postman is:

- [Introduction](https://learning.postman.com/docs/getting-started/introduction/)
- [Mock Server](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/)
- [from scratch](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/#creating-a-mock-from-scratch)

## Creating a Mock Server
Create a mock server [from scratch](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/#creating-a-mock-from-scratch) on your account's Postman's workspace page with the initial data below.

| | value |
| ---- | ---- |
| Request Method | `GET` |
| Request URL | `/oas` |
| Response Code | `200` |
| Response Body | `blank` |

Click the `Next` button at the bottom of the page to proceed to the next setting, `Configuration`. Input `RESTful Administration API Server for Viron` in the `Mock server name` field, leave other fields as they are, and click the `Create Mock Server` button to confirm.

You will use the URL of the newly created mock server, so click the `Copy Mock URL` button to copy it.

## Endpoint to Return an OAS Document
Click the `Collections` menu on the left of the page, and you will find an `example response` under the `GET /oas` request. Edit the example response body by filling it with the data below, and click the `Save` button on the top of the page.

**Content Type**: `JSON`

**Body**:

```json
{
  "openapi": "3.0.2",
  "info":{
    "title": "RESTful Administration API Server for Viron",
    "version": "mock",
    "x-pages": []
  },
  "paths": {}
}
```

**Response Headers**:

| key | value |
| ---- | ---- |
| access-control-allow-origin | `https://viron.plus` |
| access-control-allow-credentials | `true` |
| x-viron-authtypes-path | `/authentication` |
| access-control-expose-headers | `x-viron-authtypes-path` |

The [access-control-allow-origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) and [access-control-allow-credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) are **required** response headers for Viron and your endpoint to authenticate requests from Viron users.

The `x-viron-authtypes-path` response header tells Viron users how to get authenticated.

## Creating a Request for Authentication
Add a new `request` with the data below and click the `Save` button. This request provides Viron users with a way to authenticate.

| | value |
| ---- | ---- |
| Name | `/authentication` |
| Method | `GET` |
| URL | `{{url}}/authentication` |

Then, add an `example response` under the request with the data below, and click the `Save` button.

**Name**: `Default`

**Content Type**: `JSON`

**Body**:

```json
{
  "list": [],
  "oas": {
    "openapi": "3.0.2",
    "info": {
      "title": "authentication",
      "version": "mock",
      "x-pages": []
    },
    "paths": {}
  }
}
```

**Response Headers**:

| key | value |
| ---- | ---- |
| access-control-allow-origin | `https://viron.plus` |
| access-control-allow-credentials | `true` |
| x-viron-authtypes-path | `/authentication` |
| access-control-expose-headers | `x-viron-authtypes-path` |

:::note
Since the endpoint we are creating is **public**, we leave the list value an empty array.
:::

## Adding the Endpoint on the Viron Dashboard

Visit the [Viron dashboard](https://viron.plus/dashboard/endpoints) and add the endpoint you have created.

| field name | value |
| ---- | ---- |
| ID | `mock` |
| URL | `https://xxxxxxxxx.mock.pstmn.io/oas` |
| Group | `blank` |

:::note
The base URL for your endpoint is one that you have copied after creating your mock server.
:::

Go on the next step after confirming that your endpoint is on the Viron dashboard.
