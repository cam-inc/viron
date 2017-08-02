const helper = require('./helper');

/**
 * HTTP Response Error
 *
 * @example
 * {
 *   'UserNotFound': { // わかりやすいキー名をつける
 *     id: '#F-0000-1111'
 *     code: 400, // HTTP Response Code
 *     message: 'xxxxxx' // Response Message
 *   }
 * }
 *
 * id フォーマット
 * - #    : 必ずつける
 * - F    : F=フロント
 *          B=バックエンド
 *          E=外部サービスなどの外部要因
 *          M=エラー内容を外部に見せたくないときに使う
 *          U=想定していないエラー
 * - 0000 : 機能別や用途別の大きい枠で連番をつける
 * - 1111 : エラー別の連番
 *
 */
module.exports = {
  frontend: require('./frontend'),
  backend: require('./backend'),
  external: require('./external'),

  /**
   * エラー内容を外部に見せたくないエラー
   * @returns {Error}
   */
  mask: () => helper.genError('M', 500, '0000', '0000', 'InternalServerError', 'Internal Server Error'),

  /**
   * 想定していないエラー
   * @returns {Error}
   */
  unexpected: () => helper.genError('U', 500, '0000', '0000', 'InternalServerError', 'Internal Server Error'),
};
