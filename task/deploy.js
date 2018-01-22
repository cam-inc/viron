const commander = require('commander');
const ghpages = require('gh-pages');
const version = require('../package.json').version;

const [major, minor, patch] = version.split('.');

commander
  .option('-b, --beta', 'On/Off flag of beta release.')
  .parse(process.argv);

const publish = options => {
  return new Promise((resolve, reject) => {
    ghpages.publish('dist', options, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

Promise.resolve().then(() => publish({
  dest: (commander.beta ? 'beta' : `v${major}`),
  add: true
})).then(() => {
  if (commander.beta) {
    return Promise.resolve();
  }
  return publish({
    dest: 'latest',
    add: true
  });
}).catch(err => console.error(err));
