# 概要

example-nodeはDMCのバックエンドとして動作するnode.js製のアプリケーションサーバです。  
このドキュメントではDMCを自サービスに導入するために必要な技術や手順について記述します。  

## DMC

swaggerベースの汎用管理画面です。  
このドキュメントはNode.jsサーバを前提に記述していますが、  
swaggerの記法といくつかのAPIの仕様さえ合わせれば  
バックエンドの実装は言語やフレームワークに依存しない仕組みになっています。  
DMCに関する詳細なドキュメントは [DMCのREADME](../../README.md) を参照してください。  

## swagger

[swagger](https://swagger.io/)はAPIの定義を記述するための仕様です。  
現在Version3.0まで公開されていますが、DMCがサポートしているのはVersion2.0のみです。  
[2.0.md](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)  