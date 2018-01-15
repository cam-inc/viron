/**
 * GET: /viron_authtype
 */
const list = (req, res) => {
  const result = [
    // サポートしている認証を定義
    // - emailとgoogleOAuthはVironがデフォルトで提供
    {
      type: 'email',
      provider: 'viron-demo',
      url: '/signin',
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

  // ClientID,ClientSecretが設定されている場合のみGoogle認証を有効にする
  if (process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
    result.push({
      type: 'oauth',
      provider: 'google',
      url: '/googlesignin',
      method: 'POST',
    });
  }

  res.json(result);
};

module.exports = {
  'auth_type#list': list,
};
