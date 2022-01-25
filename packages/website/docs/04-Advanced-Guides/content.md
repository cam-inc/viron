---
title: Content
---

Content is a `page child`, serving mainly as a monitor to display an assigned operation's response data. Contents have a deep relationship with an OAS document as they:
- are the sources which construct requests and send them to the target endpoint.
- are the first to receive data from the target endpoint and then display it on the screen.
- communicate with users to decide what data to retrieve, when to send requests, how to show the data it has obtained, and so on.
- behave following what an OAS document says.
- handle all [related operations](./related-operations) with their own detection rules.

The content format is probably much more straightforward than you may have expected, like this:

```json
// a Page Object
{
  "id": "indicators",
  "title": "Indicators",
  // Each page may have multiple contents.
  "contents": [
    // This is a Content Object.
    {
      // Required.
      "title": "DAU",
      // Required.
      "type": "number",
      // Required.
      // Base operation that a content requires to do tasks mentioned above.
      "operationId": "fetchDau"
    }
  ]
}
```

## Base Operation

A base operation, which is specified with the `operationId` property, is a `primary operation` a content depends on to do those aforementioned fancy tasks. As the value of the operationId property is just a reference key to an operation object, the actual operation object should be defined in the OAS document.

```json
// Paths Object
"paths": {
  "/dau": {
    // This is the referenced operation object.
    "get": {
      // Same as the one in the content object.
      "operationId": "fetchDau",
      // With this information, a content knows what kind of payloads the endpoint requires.
      "parameters": [
        {
          "name": "date",
          "in": "query",
          "schema": {
            "type": "string"
          }
        }
      ],
      // With this information, a content knows how the endpoint will response to a request.
      "responses": {
        "200": {
          "content": {
            "application/json": { /* Media Object */ }
          }
        }
      }
    }
  }
}
```

## Type Property

The type property in a content object influences how response data should be displayed. For example, if its value is `number`, the content shows the data with a design suitable for numbers.

All possible values are:
- [number](./content-number)
- [table](./content-table)

Visit each page for detail.

## Default Parameters / Request Body Values

You may want to provide default payload values for the base operation to let users be free of inputting all the payloads. Here come Default Parameters and Request Body Values; like this:

```json
// Content Object
{
  "title": "DAU",
  "type": "number",
  "operationId": "fetchDau",
  // Should be an object with key of type string and value of type any.
  "defaultParametersValue": {
    "date": "2021-02-01"
  },
  // Value can be of any type.
  "defaultRequestBodyValue": any
}
```
