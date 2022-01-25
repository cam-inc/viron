---
title: Endpoint
---

**Endpoint**s are Viron's primary components, and the term Endpoint means your service's backend administration **RESTful** API server, as an **Endpoint URL** means a URL to the server.

Some example endpoints are servers:
- which work for `production` environments,
- or others like `local` or `development`.

Viron users tend to have their dashboard with multiple endpoints, each with environments.

An endpoint's main tasks are:
- To provide an OAS document.
- To handle all the operations defined in the OAS document provided.
- To support Viron-specific functions.

## Requirements
For Viron to be able to connect to an endpoint, below are requirements your server should meet:
- The response body for the request from Viron, `GET: {Endpoint URL}`,  should be a valid OAS document describing how your administration server works. Visit [here](./linter) for details on how to check if your OAS document is correctly formatted.
- The server should use HTTPS protocol for secure communication over a computer network.
- The server should be accessible publically. However, if it being accessible is not your option, visit [here](./self-hosting) to learn how to make it private.
- If the endpoint is private, it should provide Viron with ways to authenticate. [Here](./authentication) is the documentation for how to do so.

## How to Customize Appearance on the Dashboard

Viron displays endpoints on a screen reading helpful information in an OAS document:
- the [OAS-defined Info Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#infoObject)
- the Viron-extended information, such as `x-thumbnail`, `x-tags`, and `x-theme`

Below is a complete example of a fully-decorated endpoint:

```json
{
  "openapi": "3.0.2",
  // OAS-defined Info Object
  "info": {
    "title": "Awesome service X - Production",
    "version": "1.2.3",
    // A URL to a page for terms of service.
    "termsOfService": "https://sample.com/path/to/termsOfService",
    // see: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#contactObject
    "contact": {
      "name": "API Support",
      // one of url and email is required.
      "url": "https://sample.com/path/to/contact",
      "email": "contact@sample.com"
    },
    // @see: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#licenseObject
    "license": {
      "name": "License",
      "url": "https://sample.com/path/to/license",
    },
    // Used as a URL to the endpoint icon.
    "x-thumbnail": "https://sample.com/path/to/thumbnail.png",
    // Theme of the endpoint.
    "x-theme": "blue",
    // An array of string values.
    "x-tags": ["production", "QA"]
  }
}
```
