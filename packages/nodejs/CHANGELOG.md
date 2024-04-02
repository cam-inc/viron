# @viron/nodejs

## 2.3.1

### Patch Changes

- a70f57be: Set the partition option to false as the default.

## 2.3.0

### Minor Changes

- 0a02d69d: Set partitioned cookie attributes as default

## 2.2.0

### Minor Changes

- move cicd to github action and fix dependencies and test

## 2.1.2

### Patch Changes

- bug-fix domains/adminrole.ts sync method interval

## 2.1.1

### Patch Changes

- set caret on mongoose version

## 2.1.0

### Minor Changes

- 70fe4280: update some packages version
  - mongoose
  - typescript
  - casbin-mongoose-adapter
  - jest

### Patch Changes

- Updated dependencies [f8b0d18b]
  - @viron/linter@0.0.2

## 2.0.0

### Breaking Changes

- update casbin-monngoose-adapeter version.
  This version up includes the change `p_type` to `ptype` in `casbin_role` collection.
  https://github.com/node-casbin/mongoose-adapter/blob/master/CHANGELOG.md#breaking-changes
