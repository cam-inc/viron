---
title: Autocomplete
---

The [HTML autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) function assists users in filling out form field values. Below is an example:


```json
{
  "openapi": "3.0.2",
  "info": {
    "x-autocomplete": {// Configuration for the autocomplete function.
      // <datalist><option value="{responseValueKey}">{responseLabelKey}</option></datalist>
      "responseValueKey": "value", // required. (A)
      "responseLabelKey"?: "label" // optional. (B)
    }
  },
  "paths": {
    "/followers": {
      "post": {
        "operationId": "postFollower",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "userId": {
                    "type": "string",// (C)
                    "x-autocomplete": { // declare to enable the autocomplete function.
                      "operationId": "getAutocompleteUsers" // Which operation to use to fetch data for autocompletion.
                      "defaultParametersValue": { // Default payload used when sending a request.
                        "query": "${autocompleteValue}", // An environmental variable. Actual value will be the user's input value.
                        "fixed": "xxx", // An example of fixed value.
                      },
                      "defaultRequestBodyValue"?: any; // Default payload used when sending a request.
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/autocomplete/users": {
      "get": { // Operation to fetch data for autocompletion.
        "operationId": "getAutocompleteUsers",
        "parameters": [
          // The parameter for '${autocompleteValue}' should be included.
          {
            "name": "query",
            "in": 'query',
            "schema": {
              "type": "string",// Should be the same type as (C)
            }
          },
          {
            "name": "fixed",
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
                  "type": "array",// Should always be an array.
                  "items": {
                    "type": "object",
                    "properties": {
                      "value": { // Name should be the same as (A).
                        "type": "string" | "number" | "integer" | "boolean"
                      },
                      "label": { // Name should be the same as (B).
                        "type": "string" // Should always be a string.
                      }
                    },
                    "required": ["label", "value"] // Name should be the same as (A) and (B).
                  }
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
