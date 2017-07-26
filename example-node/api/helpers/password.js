const crypto = require('crypto');

/**
 * Generate password hash by pbkdf2
 * @param {string} password
 * @param {string} salt
 */
const genHash = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 512, 'sha512', (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash.toString('hex'));
    });
  });
};

/**
 * Generate password salt
 */
const genSalt = () => {
  return crypto.randomBytes(128).toString('base64');
};

/**
 * Verify password
 * @param {string} password - user input value
 * @param {string} currentPassword
 * @param {string} currentSalt
 */
const verify = (password, currentPassword, currentSalt) => {
  return genHash(password, currentSalt)
    .then(hashedPassword => {
      return currentPassword === hashedPassword;
    })
  ;
};

module.exports = {
  genSalt,
  genHash,
  verify,
};
