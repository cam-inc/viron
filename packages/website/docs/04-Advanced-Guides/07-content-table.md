---
title: Content - Table
---

The primary role of contents with the type `table` is to handle list data such as `users` or `logs`.

Content Objects in an OAS document should be like this:

```json
// Content Object
{
  "title": "Users",
  // Token to let the content be type of table.
  "type": "table",
  "operationId": "fetchUsers"
}
```

The schema for the response data **must** be of an object with a property for list data, where the value is of type **array**, and the key is specified by the `x-table` object in the Info Object.

```json
// Info Object
{
  // Should be present when at least one table content exist.
  "x-table": {
    // The value should match the one of Response Object.
    "responseListKey": "list"
  }
}
```

```json
// Response Object of the Operation fetchUsers
{
  "200": {
    "content": {
      "application/json": {
        "schema": {
          // Should be of type object.
          "type": "object",
          "properties": {
            // Must match the one in x-table object.
            "list": {
              // Should be of type array.
              "type": "array"
            }
          }
        }
      }
    }
  }
}
```

## Data Display
How data in a table cell is displayed depends on the JSON Schema's two properties: [type](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.1.1) and [format](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.7.3).  The table below describes how the combination of those two affects data display.

| type | format | description |
| --- | --- | --- |
| `string` | `-` | with a plain string. |
| `string` | `uri` | a link string with the `<a>`. |
| `string` | `uri-image` | an image with the `<img>`. |
| `number` | `-` | with a plain locale string. |
| `integer` | `-` | with a plain locale string. |
| `object` | `-` | with a plain string. |
| `array` | `-` | with a plain string. |
| `boolean` | `-` | `TRUE` or `FALSE`. |

:::note
Please send a [feature request](https://github.com/cam-inc/viron/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=) for new combinations.
:::
