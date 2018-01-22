const moment = require('moment-timezone');

const TIME_ZONE = 'Asia/Tokyo';

const helper = {
  getFormattedJst: () => {
    return moment().tz(TIME_ZONE).format();
  },
  stringify: obj => {
    return JSON.stringify(obj);
  },
  infoLog: msg => {
    return console.log(msg);
  },
};

class Config {

  constructor() {
  }

  init(config) {
    for (let k in config) {
      this[k] = config[k];
    }
    return this;
  }

  load(env) {
    return new Promise(resolve => {
      resolve(require(`./${env}.js`)(helper));
    }).then(conf => {
      return this.init(conf);
    });
  }
}

module.exports = new Config();
