---
title: Page
---

This function enables you to manage how and where all contents are displayed. Viron creates **unique URLs** and assigns them to each page so that users can `navigate` between pages or `access directly` to a specific page.

:::note
It is meaningless if the value of `x-pages` is an empty array since it means your endpoint has nothing to show --- no need to mention the value of contents in a Page Object.
:::

## How to Manage Pages
Define the `x-pages` property under the Info Object with an array of `Page Object`s to manage all pages, like this:

```json
// an OAS document.
{
  "openapi": "3.0.2",
  "info": {
    // Should be an array of Page Objects
    "x-pages": [
      // This is a Page Object.
      {
        // Required and used as a part of the unique URL.
        "id": "userLists",
        // Required.
        "title": "User Lists",
        // Value should be string or CommonMark string.
        "description": "Lists of users.",
        "contents": [
          // All contents in a page come here.
        ]
      }
    ]
  }
}
```
## How to Group Pages
Page Object has a property `group` to organize pages hierarchically. The value should be of type `string`, and the letter `/` is used to express how deep a particular page is in the hierarchy.

```json
// an OAS document.
{
  "openapi": "3.0.2",
  "info": {
    "x-pages": [
      // Page Object grouped as ``.
      {
        "group": "performance/Web Vitals"
        "id": "lcp",
        "title": "LCP",
        "contents": [/* Content Object */]
      },
      {
        "group": "performance/Web Vitals"
        "id": "fid",
        "title": "FID",
        "contents": [/* Content Object */]
      },
      {
        "group": "performance/Web Vitals"
        "id": "cls",
        "title": "CLS",
        "contents": [/* Content Object */]
      }
    ]
  }
}
```
