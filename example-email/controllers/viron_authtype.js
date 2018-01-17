/**
 * GET: /viron_authtype
 */
const list = (req, res) => {
  const result = [
    {
      type: 'email',
      provider: 'viron-demo',
      url: '/signin',
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
