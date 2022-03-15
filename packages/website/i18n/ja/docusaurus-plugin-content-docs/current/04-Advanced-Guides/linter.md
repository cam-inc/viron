---
title: Linter
---

[@viron/linter](https://www.npmjs.com/package/@viron/linter) is a `Viron`-scoped npm package that analyzes your OAS documents and finds problems. It is a wrapper package of [Ajv](https://github.com/ajv-validator/ajv), a JSON schema validator, with custom validations for Viron-specific functions.

## Installation
You can install `@viron/linter` using npm.

```shell
$ npm install @viron/linter
```

## Usage
The following code excerpt demonstrates a basic usage example.

```js
import { lint } from '@viron/linter';

const document = {
  // Your OAS document.
};

const result = lint(document);

if (result.isValid) {
  // Your OAS document is valid.
  console.log('OK');
} else {
  // Your OAS document is NOT valid.
  console.error(result.errors);
}
```
