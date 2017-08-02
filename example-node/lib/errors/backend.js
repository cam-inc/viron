const helper = require('./helper');

/**
 * HTTP Response Error インスタンス生成
 * @param httpCode HTTP Response Code
 * @param kind 種別
 * @param number 連番
 * @param name エラー名
 * @param message エラーメッセージ
 * @returns {Error}
 */
const genError = (httpCode, kind, number, name, message) => {
  return helper.genError('B', httpCode, kind, number, name, message);
};

module.exports = {

  /**
   * サーバーエラー全般に使用する。
   * @returns {Error}
   * @constructor
   */
  InternalServerError: () => genError(500, '0000', '0000', 'InternalServerError', 'Internal Server Error'),
};
