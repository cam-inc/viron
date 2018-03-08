const mout = require('mout');
const replace = require('replace-in-file');
const vironConfig = require('../viron');

let to = '';
const components = vironConfig.components || [];
mout.array.forEach(components, component => {
  to += `@import "../../${component.css}";`;
});
const options = {
  files: 'src/css/app.tmp.css',
  from: /\/\*__VIRON_COMPONENTS_CSS__\*\//g,
  to
};
replace.sync(options);
