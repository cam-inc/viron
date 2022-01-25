---
title: Auto-Refresh
---

This function enables a content to re-fetch periodically with an interval of seconds you have specified. One possible use case would be to display the latest number of DAU.

```json
// Content Object
{
  "title": "DAU",
  "type": "number",
  "operationId": "fetchDau",
  // Specify here
  "autoRefreshSec": 60
}
```
