/**
 * dmclib固有のエラー型
 */
class DmcLibError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
}

/**
 * HTTP Response Error インスタンス生成
 * @param prefix ErrorID prefix
 * @param httpCode HTTP Response Code
 * @param kind 種別
 * @param number 連番
 * @param name エラー名
 * @param message エラーメッセージ
 * @returns {Error}
 */
const genError = (prefix, httpCode, kind, number, name, message) => {
  const err = new DmcLibError(message);
  err.statusCode = httpCode;
  err.data = {
    id: `#${prefix}-${kind}-${number}`,
    code: httpCode,
    name: name,
    message: message
  };
  return err;
};

module.exports = {
  genError,
};
