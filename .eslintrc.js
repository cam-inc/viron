module.exports = {
  // 詳細：https://eslint.org/docs/user-guide/configuring#specifying-environments
  "env": {
    // ブラウザのグローバル変数
    "browser": true,
    // モジュールを除くすべてのECMAScript 6機能を有効にする（自動的にecmaVersion parserオプションが6に設定される）
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
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
    // for文の無限ループを許可しない
    "for-direction": "error",
    // 不要なカッコを消す。ただし、ネストされた式は例外。例):x = a || (b && c);
    "no-extra-parens": ["error", "all", { "nestedBinaryExpressions": false }],
    // 必要のないbooleancastの使用でエラーを出さない
    "no-extra-boolean-cast": "off",
    // 関数周りに不要なカッコをつけない
    "no-extra-parens": ["error", "functions"],
    /** 
     * Best Practices
     */
    // alert, prompt, confirmの使用を許可しない。
    "no-alert": "error",
    // eval関数の使用を禁止する
    "no-eval": "error",
    // 浮動小数点数を許可しない 例)var num = .5;
    "no-floating-decimal": "error",
    // インデントに使用されない行内の複数のスペースを許可しない。
    "no-multi-spaces": "error",
    // 自己比較を許可しない 例）x===x
    "no-self-compare": "error",
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
    // arrow関数の引数が一つの場合()をつけない。
    "arrow-parens": ["error", "as-needed"],
    // aorrow関数の => の前後にスペースを入れる。
    "arrow-spacing": "error",
    // generator関数の*の後ろにスペースを入れる。
    "generator-star-spacing": ["error", {"before": false, "after": true}],
    // 比較を混乱させる矢印機能を禁止する NO：var x = a => 1 ? 2 : 3;　OK：var x = a => { return 1 ? 2 : 3; };
    "no-confusing-arrow": "error",
    // 計算されたプロパティキーの不必要な使用を許可しない。
    "no-useless-computed-key": "error",
    // 空のコンストラクタを許可しない。
    "no-useless-constructor": "error",
    // インポート、エクスポート、および非構造化割り当ての名前を同じ名前に変更不可
    "no-useless-rename": "error",
    // varでの宣言を不可 let or const
    "no-var": "error",
    // テンプレート文字列内${}内にスペースを入れないように設定。
    "template-curly-spacing": "error",
  }
};
