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
    "responseKey": "list"
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
