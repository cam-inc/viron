---
id: url
title: URL
slug: /
---

**注意** ドキュメントに含めるべきではない情報も含まれています。どの情報をどこに載せるべきか、改めて精査すること。

## URLの種類

以下の2つのタイプのURL
- latest: 最新バージョンのvironを使うため
- snapshot: 特定バージョンのvironを使うため

| type | S3 Bucket | Bucket内ディレクトリ | URL |
| ---- | ---- | ---- | ---- |
| latest | s3://app.viron.plus | 無し | https://viron.plus/ |
| snapshot | s3://snapshot-app.viron.plus | semver名 | https://snapshot.viron.plus/{semver}/ |

## S3 Buckets

latest用
```
s3://app.viron.plus/
  - Gatsby Build生成物
```

snapshot用
```
s3://snapshot-app.viron.plus/
  - 1.0.0
    - Gatsby Build生成物
  - 2.0.0
    - Gatsby Build生成物
```


## ユーザがどのURLを使うべきか

常に最新のVironを使いたい -> https://viron.plus/
v1.0.0のVironを使いたい -> https://snapshot.viron.plus/1.0.0/
v2.0.0のVironを使いたい -> https://snapshot.viron.plus/2.0.0/

## CF
https://viron.plus/ -> s3://app.viron.plus
https://snapshot.viron.plus/{semver}/ -> s3://snapshot-app.viron.plus/{semver}


## S3 Bucketに静的ファイルがdeployされるまでの流れ

(通常時とpatch時の違いは、latest用build/deployを行うか否かだけ。)

### 通常リリース時

1. `main`ブランチにpush
2. `1`をtriggerに、AWS CodePipelineが動く。
3. `npm run build --workspace=@viron/app`が実行される。
4. `3`の生成物が`s3://app.viron.plus`バケット配下にdeployされる。(latest用)
5. `npm run build:prefix --workspace=@viron/app`が実行される。
6. `5`の生成物が`s3://snapshot-app.viron.plus`バケット配下の特定ディレクトリ(package.jsonのversion値と一緒)配下にdeployされる。(snapshot用)

## patchリリース時

1. 修正対象のversionのreleaseタグからブランチを作成する。
2. 修正する
3. `snapshot`ブランチにpush
4. `3`をtriggerに、AWS CodePipelineが動く。
5. `npm run build:prefix --workspace=@viron/app`が実行される。
6. `5`の生成物が`s3://snapshot-app.viron.plus`バケット配下の特定ディレクトリ(package.jsonのversion値と一緒)配下にdeployされる。(snapshot用)

## タグ
リリース毎(package.jsonのversion)のタグが存在する。

## バグ修正の流れ

### 「最新版のVironでxxxがバグってる」

修正してpatchバージョンを上げて、上記「通常リリース時」を行う。

latest用
```
s3://app.viron.plus/
  - 修正済みGatsby Build生成物 // ここも変わるよ。
```

snapshot用
```
s3://snapshot-app.viron.plus/
  - 1.2.3
    - バグってるGatsby Build生成物
  - 1.2.4 // このディレクトリを足すってことね。
    - 修正済みGatsby Build生成物
```

### 「特定versionのVironでxxxがバグってる」

対象バーションのタグを元に修正して、上記「patchリリース時」を行う。
最新patch値のURLを使うように促す。

snapshot用
```
s3://snapshot-app.viron.plus/
  - 1.2.3
    - バグってるGatsby Build生成物
  - 1.2.4 // このディレクトリを足すってことね。
    - 修正済みGatsby Build生成物
  - 2.3.4
    - 最新のGatsby Build生成物
```
