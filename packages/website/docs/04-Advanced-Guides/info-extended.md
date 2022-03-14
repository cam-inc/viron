---
title: Extended Info Object
---

This page explains the [OAS Info Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#infoObject) and the functions extended on it for Viron to shine.

```json
"info": {
  "title": "Project A", // (A)
  "description": "A administration for the project A of development environment.",
  "version": "latest", // (C)
  "contact": { // (D)
    // Contact Object
  },
  "termsOfService": "URL", // (D)
  "license": { // (D)
    // License Object
  },
  "x-thumbnail": "URL", // (E)
  "x-theme": "red", // (F)
  "x-tags": [// (G)
    "development", "QA", "project A"
  ]
}
```

## Title - (A)
This property defines the title of the endpoint. Viron uses this value when displaying the endpoint's general information on pages such as the dashboard.

## Description - (B)
This is a summary of the endpoint. [CommonMark](http://spec.commonmark.org/) syntax may be used for rich text representation.

## Version - (C)
This property defines the version of the endpoint, **not** that of the OAS.

## Contact, Terms of Service, and License - (D)
Those are the same as the OAS [Contact Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#contactObject), URL, and [License Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#licenseObject).

## Thumbnail - (E)
Use this property to show a thumbnail image. If not specified, the thumbnail image will be a Viron logo.

## Theme - (F)
This property affects how your endpoint page gets colored. The main scenario of using this is to visually differentiate endpoints of the same project; the endpoint for the development environment with blueish, for production reddish, and so on. Read [this](/docs/Advanced-Guides/theme) for detail.

## Tag - (G)
This property is different from the OAS [Tag Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#tag-object), as `x-tag`s relates to the endpoint while the OAS's tags is used by operations.
