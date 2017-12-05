import isObject from 'mout/lang/isObject';
import ObjectAssign from 'object-assign';

/**
 * body値をContent-Type `application/json`に最適化します。
 * @param {*} body
 * @return {*}
 */
const jsonConverter = body => {
  return JSON.stringify(body);
};

/**
 * body値をContent-Type `application/x-www-form-urlencoded`に最適化します。
 * @param {*} body
 * @return {*}
 */
const urlEncodedStandardQueryStringConverter = body => {
  const strings = [];
  const keys = Object.keys(body);

  keys.forEach(key => {
    const value = body[key];
    const string = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

    strings.push(string);
  });

  return strings.join('&');
};

/**
 * body値をContent-Type `multipart/form-data`に最適化します。
 * @param {*} body
 * @return {*}
 */
const formDataConverter = body => {
  const formData = new FormData();
  const keys = Object.keys(body);

  keys.forEach(key => {
    const value = body[key];

    if (isObject(value) || Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value != null) {
      formData.append(key, value);
    }
  });

  return formData;
};

/**
 * 共通設定が施されたFetch API。
 * @param {riotx.Context} context
 * @param {String} url
 * @param {Object} options
 * @return {Promise}
 */
const commonFetch = (context, url, options) => {
  options = ObjectAssign({
    mode: 'cors',
    // redirect方法はレスポンスにそう形にする。
    redirect: 'follow',
    headers: {
      // 何も指定しない場合はこれをデフォルトにする。
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  }, options);

  // `Content-Type`に応じてbody内容を書き換えます。
  if (!!options.body && (options.method === 'POST' || options.method === 'PUT')) {
    switch (options.headers['Content-Type']) {
    case 'application/json':
      options.body = jsonConverter(options.body);
      break;
    case 'application/x-www-form-urlencoded':
      options.body = urlEncodedStandardQueryStringConverter(options.body);
      break;
    case 'multipart/form-data':
      options.body = formDataConverter(options.body);
      break;
    default:
      break;
    }
  }

  const networkingId = `networking_${Date.now()}`;
  return Promise
    .resolve()
    .then(() => context.commit('application.addNetworking', {
      id: networkingId,
      url,
      options
    }))
    .then(() => Promise.race([
      fetch(url, options),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('時間がかかり過ぎたため通信を中断しました。'));
        }, 1000 * 10);
      })
    ]))
    .then(response => {
      context.commit('application.removeNetworking', networkingId, context);
      return response;
    })
    .then(response => { // status check.
      if (!response.ok) {
        return Promise.reject(response);
      }
      return Promise.resolve(response);
    })
    .catch(err => {
      context.commit('application.removeNetworking', networkingId, context);
      throw err;
    });
};

export { commonFetch as fetch };
