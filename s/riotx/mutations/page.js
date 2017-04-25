import {forOwn} from 'mout/object';

import constants from '../../core/constants';


let mergePropertiesAndResponse = (properties, response, key) => {
  if (properties.type === 'array') {
    let res = [];
    forOwn(response, (v, k) => {
      let ret = mergePropertiesAndResponse(properties.items, v, k);
      res.push(ret);
    });
    return res;
  }

  let res = {};

  if (properties.type === 'object') {
    forOwn(properties.properties, (v, k) => {
      let ret = mergePropertiesAndResponse(v, response[k], k);
      res[k] = ret;
    });
    return res;
  }

  //
  res.key = key;
  res.definition = properties;
  res.value = response;

  return res;

};

export default {
  show: function (context, obj) {
    const schema = obj.model.responses[200].schema;
    // const properties = schema.properties;
    const response = obj.response;

    let merge = mergePropertiesAndResponse(schema, response);

    context.state.page = {
      data: merge,
      layout: obj.layout,
    };

    return [constants.CHANGE_PAGE];
  },
};
