import { contains, filter, forEach, map } from 'mout/array';
import { forOwn } from 'mout/object';
import constants from '../../core/constants';
import swagger from '../../swagger';

export default {
  one: function (context, params) {
    const schema = params.operationObject.responses[200].schema;
    // const properties = schema.properties;
    const responseObj = params.response.obj;

    const merge = swagger.mergePropertiesAndResponse(schema, responseObj);
    const _data = swagger.mergeSchemaAndResponse(schema, responseObj);

    context.state.components[params.component_uid] = context.state.components[params.component_uid] || {};
    context.state.components[params.component_uid].data = merge;
    context.state.components[params.component_uid]._data = _data;
    // `component.pagination` value indicates whether the component supports pagination or not.
    // if supported then manually add pagination information from headers.
    if (params.component.pagination.get()) {
      context.state.components[params.component_uid].pagination = {
        currentPage: Number(params.response.headers['x-pagination-current-page'] || 0),
        size: Number(params.response.headers['x-pagination-limit'] || 0),
        maxPage: Number(params.response.headers['x-pagination-total-pages'] || 0)
      };
    }
    // `component.query`(array) value indicates whether the component supports searching or not.
    // if supported then manually add pagination information from headers.
    if (params.component.query.length && !!params.component.query.length) {
      context.state.components[params.component_uid].search = params.component.query;
    }
    // manually add paths that component can execute.
    const actions = [];
    forEach(params.pathRefs, ref => {
      const pathItemObject = swagger.getPathItemObjectByPath(ref.path);
      forOwn(pathItemObject, (value, key) => {
        if (contains(['put', 'post', 'delete', 'options', 'head', 'patch'], key)) {
          actions.push({
            isSelf: ref.isSelf,
            operationObject: value
          });
        }
      });
    });
    context.state.components[params.component_uid].selfActions = map(filter(actions, action => {
      return action.isSelf;
    }), action => {
      return action.operationObject;
    });
    context.state.components[params.component_uid].childActions = map(filter(actions, action => {
      return !action.isSelf;
    }), action => {
      return action.operationObject;
    });

    return [constants.changeComponentsName(params.component_uid)];
  },

  removeAll: context => {
    context.state.components = {};
    return [constants.CHANGE_COMPONENTS];
  },

  removeOne: (context, component_uid) => {
    delete context.state.components[component_uid];
    return [constants.changeComponentsName(component_uid)];
  }
};
