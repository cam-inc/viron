const commander = require('commander');
const ghpages = require('gh-pages');
const version = require('../package.json').version;

const [major, minor, patch] = version.split('.');

commander
  .option('-b, --beta', 'On/Off flag of beta release.')
  .option('-c, --rc', 'On/Off flag of release candidate.')
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

Promise.resolve().then(() => {
  let dest;
  if (commander.beta) {
    dest = 'beta';
  } else if (commander.rc) {
    dest = 'rc';
  } else {
    dest = `v${major}`;
  }
  return publish({
    dest,
    add: true
  });
}).then(() => {
  if (commander.beta || commander.rc) {
    return Promise.resolve();
  }
  return publish({
    dest: 'latest',
    add: true
  });
}).catch(err => console.error(err));
