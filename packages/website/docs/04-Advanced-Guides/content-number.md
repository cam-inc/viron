---
title: Content - Number
---

The primary role of contents with the type `number` is to handle response data such as DAU, PV, or any kind of number-related ones.

Content Objects in an OAS document should be like this:

```json
// Content Object
{
  "title": "DAU",
  // Token to let the content be type of number.
  "type": "number",
  "operationId": "fetchDau"
}
```

The schema for the response data **must** be of an object with a single key-value pair, where the value is of a `number`, and the key is specified by the `x-number` object in the Info Object.

```json
// Info Object
{
  // Should be present when at least one number content exist.
  "x-number": {
    // The value should match the one of Response Object.
    "responseKey": "myValue"
  }
}
```

```json
// Response Object of the Operation fetchDau
{
  "200": {
    "content": {
      "application/json": {
        "schema": {
          // Should be of type object.
          "type": "object",
          "properties": {
            // Must match the one in x-number object.
            "myValue": {
              // Should be of type number.
              "type": "number"
            }
          }
        }
      }
    }
  }
}
```

:::note
The reason why returning data of just a number is not allowed is because the [http module](https://nodejs.org/api/http.html) often used in [Express](https://expressjs.com/), the famous web framework for Node.js, triggers an error when the value of response is number `0`.
:::
