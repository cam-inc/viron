---
title: Your First Page
---

As the second step of our guide, we will create a Viron `Page` that enables you to manage how and where all contents are displayed on the Viron endpoint page.

## Editing the OAS Document
Edit the example response body of the request `GET /oas` as follows:

```json {6-19}
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
        "contents": []
      },
      {
        "id": "page02",
        "title": "Page Two",
        "group": "sample",
        "contents": []
      }
    ]
  },
  "paths": {}
}
```

Here we have set our endpoint to have two pages grouped in a group named `sample`. Click the `Enter` button on the Viron dashboard to navigate to the Viron endpoint, and you will find that those pages and groups are shown as a **navigator** on the left side and each page displayed on the center.

:::note
Visit documentations for [page](/docs/Advanced-Guides/page) and [group](/docs/Advanced-Guides/group) for detail.
:::
