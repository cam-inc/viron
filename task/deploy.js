const commander = require('commander');
const ghpages = require('gh-pages');
const version = require('../package.json').version;

const [major, minor, patch] = version.split('.');

commander
  .option('-b, --beta', 'On/Off flag of beta release.')
  .parse(process.argv);

new Promise((resolve, reject) => {
  const options = {
    dest: (commander.beta ? 'beta' : `v${major}`),
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
