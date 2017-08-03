const axios = require('axios');
const gapi = require('googleapis');
const contains = require('mout/array/contains');

const getClient = options => {
  return new gapi.auth.OAuth2(
    options.client_id,
    options.client_secret,
    options.redirect_url
  );
};

const genAuthUrl = options => {
  const client = getClient(options);
  return client.generateAuthUrl({
    scope: options.scope || [],
    state: options.state_url,
  });
};

const getToken = (code, options) => {
  const client = getClient(options);
  return new Promise((resolve, reject) => {
    client.getToken(code, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token.access_token);
    });
  });
};

const getMailAddress = token => {
  const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
  return axios.get(url, {
    headers: {
      Authorization: `OAuth ${token}`,
    },
  })
    .then(res => {
      return res.data.email;
    })
  ;
};

const allowMailDomain = (token, options) => {
  return getMailAddress(token)
    .then(email => {
      const domain = email.split('@')[1];
      return contains(options.allow_email_domains, domain) && email;
    })
  ;
};

module.exports = {
  getClient,
  genAuthUrl,
  getToken,
  getMailAddress,
  allowMailDomain,
};
