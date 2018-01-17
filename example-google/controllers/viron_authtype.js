/**
 * GET: /viron_authtype
 */
const list = (req, res) => {
  const result = [
    {
      type: 'oauth',
      provider: 'google',
      url: '/googlesignin',
      method: 'POST',
    },
    {
      type: 'signout',
      provider: '',
      url: '',
      method: 'POST',
    },
  ];

  res.json(result);
};

module.exports = {
  'auth_type#list': list,
};
