const version = require('../package.json').version;
const ghpages = require('gh-pages');
const [major, minor, patch] = version.split('.');

new Promise((resolve, reject) => {
  const options = {
    dest: `v${major}`,
    add: true
  };
  ghpages.publish('dist', options, err => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
  });
}).catch(err => console.error(err));
