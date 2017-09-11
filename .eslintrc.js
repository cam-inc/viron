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
  * 詳細：https://eslint.org/docs/user-guide/configuring#configuring-rules
  * ルール一覧。公式(https://eslint.org/docs/rules/)
  * 配列の最初の項目は、常にルールの重大度（数値または文字列)
  * ルールID
  * "off" or 0 ルールを無効化する
  * "warn" or 1 ルールを警告としてオンにします（終了コードには影響しない）
  * "error" or 2 ルールをエラーとしてオンにします
  */
  "rules": {
    /** 
     * Possible Errors
     */
    // 必要のないbooleancastの使用でエラーを出さない
    "no-extra-boolean-cast": "off",
    // 関数周りに不要なカッコをつけない
    "no-extra-parens": ["error", "functions"],
    /** 
     * Best Practices
     */
    // 不要なエスケープの使用を許可する。正規表現で使用するため。
    "no-useless-escape": "off",
    /** 
     * Stylistic Issues 
     */
    // インデントは半角スペース2つ
    "indent": ["error",2],
    // クォーテーション関連のエラー。シングルクォーテーションを使用するように設定。
    "quotes": ["error","single"],
    // セミコロン関連のエラー。セミコロンは使用するように設定。
    "semi": ["error","always"],
    // {}の前にスペースを入れる
    "space-before-blocks": ["error","always"],
    // `function`や`if`などのJavaScriptの構文要素の前後に一貫したスペースを入れる。
    "keyword-spacing": ["error",{"after": true}],
    /** 
     * ECMAScript 6
     */
    // 関数本体の周囲に中{}を使用する
    // "arrow-body-style": ["error", "always"],
    // arrow関数の引数が一つの場合()をつけない。
    "arrow-parens": ["error", "as-needed"],
    // aorrow関数の => の前後にスペースを入れる。
    "arrow-spacing": "error",
    // generator関数の*の後ろにスペースを入れる。
    "generator-star-spacing": ["error", {"before": false, "after": true}],
    // 比較を混乱させる矢印機能を禁止する NO：var x = a => 1 ? 2 : 3;　OK：var x = a => { return 1 ? 2 : 3; };
    "no-confusing-arrow": "error",
    // 同じ場所からのmoduleインポートは一行にまとめる。
    // "eslint no-duplicate-imports": "error",
    // 計算されたプロパティキーの不必要な使用を許可しない。
    "no-useless-computed-key": "error",
    // 空のコンストラクタを許可しない。
    "no-useless-constructor": "error",
    // インポート、エクスポート、および非構造化割り当ての名前を同じ名前に変更不可
    "no-useless-rename": "error",
    // varでの宣言を不可 let or const
    "no-var": "error",
    // letで割り当てられいるが再定義されていないかのエラーを表示させる。https://eslint.org/docs/rules/prefer-const
    // "prefer-const": "error",
    // テンプレートリテラルを使用するように設定
    "prefer-template": "error",
    // importをアルファベット順にソート https://eslint.org/docs/rules/sort-imports
    // "sort-imports": "error"
    // テンプレート文字列内${}内にスペースを入れないように設定。
    "template-curly-spacing": "error"
  }
};
