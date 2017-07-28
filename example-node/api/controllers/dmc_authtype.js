/**
 * GET: /dmc_authtype
 */
const list = (req, res) => {
  const result = [
    // サポートしている認証を定義
    // - emailとgoogleOAuthはDMCがデフォルトで提供
    {
      type: 'email',
      provider: 'example-node',
      url: '/signin',
      method: 'POST',
    },
    {
      type: 'oauth',
      provider: 'google',
      url: '/googlesignin',
      method: 'POST',
    },
    // signoutは必須
    {
      type: 'signout',
      provider: '',
      url: '/signout',
      method: 'POST',
    },
  ];

  res.json(result);
};

module.exports = {
  'auth_type#list': list,
};
