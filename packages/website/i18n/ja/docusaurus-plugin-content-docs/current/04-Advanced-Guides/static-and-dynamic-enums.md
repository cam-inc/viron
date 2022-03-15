---
title: Static and Dynamic Enums
---

It is common for administrators to restrict users to input only values allowed by them. For example, a possible scenario would be when a user adds a blog post data with title, body, and category; and you want to let them select a category value from a predefined set. This constraint can be set by using the **static and dynamic enum** functions.


## Static Enum

Use the **static enum** function to define a list of values statistically; for situations where an OAS document contains all the predefined values.

Below is a sample code:

```json {16-22}
// Operation Object
{
  "operationId": "createBlogPost",
  "requestBody": {
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "body": {
              "type": "string"
            },
            // This is a property with the static enum function on.
            "category": {
              "type": "string",
              // These are statistically defined values.
              // Each value in the array should be the same type as the one above.
              "enum": ["backend", "frontend", "design"]
            }
          }
        }
      }
    }
  }
}

```

## Dynamic Enum

Use the **dynamic enum** function if defining a list of values is difficult or impossible. For example, one assumed situation is where the list of category values constantly changes according to some other related data, so you want users to fetch the latest data every time they are adding a new blog post data.

Below is an example:

```json {16-31}
// Operation Object
{
  "operationId": "createBlogPost",
  "requestBody": {
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "body": {
              "type": "string"
            },
            // This is a property with the dynamic enum function on.
            "category": {
              // ---[A]---
              // Should match the type of [B].
              "type": "string",
              "x-enum": {
                // Specify an OAS operation to tell Viron where to send a request.
                "operationId": "fetchBlogPostCategoryList",
                // ---[C]---
                // Define parameter values if the target operation requires them.
                // The type of data is free as long as it matches [D].
                "defaultParametersValue": {
                  "type": "latest"
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

```json
// A operation object for retrieving a enum list.
// The method should be `get`.
{
  "operationId": "fetchBlogPostCategoryList",
  // ---[D]---
  // Should match the type of [C].
  "parameters": [
    {
      "name": "type",
      "in": "query",
      "schema": {
        "type": "string"
      }
    }
  ],
  "responses": {
    "200": {
      "content": {
        "application/json": {
          "schema": {
            // Should always be type of `array`.
            "type": "array",
            "items": {
              // ---[B]---
              // Should match the type of [A].
              "type": "string"
            }
          }
        }
      }
    }
  }
}

```
