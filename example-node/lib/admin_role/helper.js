const contains = require('mout/array/contains');

// 常にアクセスOKなリソース
const whiteList = [
  'dmc',
  'swagger.json',
  'dmc_authtype',
  'signin',
  'signout',
  'googlesignin',
  'googleoauth2callback',
  'ping',
];

/**
 * パスに対してアクセス権があるかチェックする
 * @param {string} path
 * @param {string} method
 * @param {array} roles
 */
const canAccess = (path, method, roles) => {
  method = method.toLowerCase();
  const resource = path.split('/')[1];
  const _roles = roles[method] || [];
  return !resource || contains(whiteList, resource) || contains(_roles, '*') || contains(_roles, resource);
};

module.exports = {
  canAccess,
  whiteList,
};
