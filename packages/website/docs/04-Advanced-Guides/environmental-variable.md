---
title: Environmental Variable
---

Environmental variables are predefined strings that are to be replaced on runtime by Viron. In other words, they are something that you need help from Viron to decide its value. For example, to provide a list of auto-completed user IDs, you will need to know some query parameter values to return the list. But it is impossible to predefine those values as default parameters in an OAS document because users are the ones who decide them, not you.

This function allows you to tell Viron where those potential parameter values should be used by marking the target with predefined environmental variables:
- ${autocompleteValue} - query parameter values for auto-complete function.
- ${oauthRedirectURL} - a redirect URL used for OAuth.

Below is an example:

```json {11}
// Parameters Object
"parameters": [
  {
    "name": "userId",
    "in": "query",
    "schema": {
      "type": "string",
      'x-autocomplete': {
        operationId: 'getAutocompleteUserIds'
        defaultParametersValue: {
          q: '${autocompleteValue}'
        }
      }
    }
  }
]
```

will be replaced dynamically on runtime with

```json {11-12}
// Parameters Object
"parameters": [
  {
    "name": "userId",
    "in": "query",
    "schema": {
      "type": "string",
      'x-autocomplete': {
        operationId: 'getAutocompleteUserIds'
        defaultParametersValue: {
          // A string that a user is progressively typing.
          q: 'viro'
        }
      }
    }
  }
]
```
