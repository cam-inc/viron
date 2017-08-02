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
  return helper.genError('E', httpCode, kind, number, name, message);
};

module.exports = {
  /**
   * 外部APIのエラー全般に使用する.
   */
  ExternalServerError: () => genError(500, '0000', '0000', 'ExternalServerError', 'External Server Error'),
  /**
   * 外部APIのリクエストエラー全般に使用する.
   */
  ExternalBadRequest: () => genError(400, '0000', '0001', 'ExternalBadRequest', 'External Bad Request'),
};
