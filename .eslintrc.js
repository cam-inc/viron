module.exports = {
  // 有効にしたい環境を設定
  // 詳細：https://eslint.org/docs/user-guide/configuring#specifying-environments
  "env": {
    // ブラウザのグローバル変数
    "browser": true,
    // モジュールを除くすべてのECMAScript 6機能を有効にする（自動的にecmaVersion parserオプションが6に設定される）
    "es6": true
  },
  // 有効なルールのセットを基本設定から拡張
  // recommnendedを追加すると公式(https://eslint.org/docs/rules/)のチェックマークが付いたルールが有効化される
  "extends": "eslint:recommended",
  // パーサーを指定する事で解析エラーを判別するのに役立つ
  "parserOptions": {
    // sourceType = sourceCodeがECMAScriptモジュールの場合は "script"（デフォルト）または "module"に設定します。
    "sourceType": "module"
  },
  /** 
  * 構成コメントまたは構成ファイルを使用して、プロジェクトで使用するルールを変更できる。
  * ルール設定を変更するには、ルールIDを次のいずれかの値に設定する必要があります。
  * 詳細：https://eslint.org/docs/user-guide/configuring#configuring-rules
  * ルール一覧。公式(https://eslint.org/docs/rules/)
  * 配列の最初の項目は、常にルールの重大度（数値または文字列）です。
  * ルールID
  * "off" or 0 ルールを無効化する
  * "warn" or 1 ルールを警告としてオンにします（終了コードには影響しない）
  * "error" or 2 ルールをエラーとしてオンにします
  */
  "rules": {
    // インデントは半角スペース2つ
    "indent": [
      "error",
      2
    ],
    // --fixed クォーテーション関連のエラー
    "quotes": [
      "error",
      "single"
    ],
    // セミコロン関連のエラー
    "semi": [
      "error",
      "always"
    ],
    // --fixed "extends": "eslint:recommended"
    // 必要のないbooleancastの使用でエラーを出さない
    "no-extra-boolean-cast": "off",
    // "extends": "eslint:recommended"
    // 不要なエスケープの使用を許可する。正規表現で使用するため。
    "no-useless-escape": "off",
    // ブロック{}の前にスペースが入っていたらエラーを表示させる
    "space-before-blocks": [
      "error",
      "always"
    ],
    // --fixed キーワードの前後に一貫した間隔を適用する
    // キーワードとは`function`や`if`などのJavaScriptの構文要素
    // https://eslint.org/docs/rules/keyword-spacing
    "keyword-spacing": [
      "error",
      {
        "after": true
      }
    ]
  }
};
