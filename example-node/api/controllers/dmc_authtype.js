/**
 * GET: /dmc_authtype
 */
const list = (req, res) => {
  const result = [
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
