import forEach from 'mout/array/forEach';
import ObjectAssign from 'object-assign';
import swagger from '../../core/swagger';
import { constants as states } from '../states';

export default {
  /**
   * 一件更新します。
   * @param {riotx.Context} context
   * @param {Object} params
   * @return {Array}
   */
  updateOne: (context, params) => {
    const schema = params.operationObject.responses[200].schema;
    const responseObj = params.response.obj;
    const data = swagger.mergeSchemaAndResponse(schema, responseObj);

    context.state.components[params.component_uid] = context.state.components[params.component_uid] || {};
    context.state.components[params.component_uid].data = data;
    // `component.pagination`からページングをサポートしているか判断する。
    // サポートしていれば手動でページング情報を付加する。
    if (params.component.pagination) {
      context.state.components[params.component_uid].pagination = {
        // `x-pagination-current-page`等は独自仕様。
        // DMCを使用するサービスはこの仕様に沿う必要がある。
        currentPage: Number(params.response.headers['x-pagination-current-page'] || 0),
        size: Number(params.response.headers['x-pagination-limit'] || 0),
        maxPage: Number(params.response.headers['x-pagination-total-pages'] || 0)
      };
    }
    // `component.query`(array)からクエリ検索をサポートしているか判断する。
    // サポートしていれば手動でクエリ情報を付加する。
    if (params.component.query && !!params.component.query.length) {
      context.state.components[params.component_uid].search = params.component.query;
    }
    // 関連API(path)群を付与する。
    const actions = [];
    forEach(params.pathRefs, ref => {
      const pathItemObject = swagger.getPathItemObjectByPath(ref.path);
      if (!pathItemObject[ref.method]) {
        return;
      }
      actions.push(ObjectAssign({
        pathItemObject: pathItemObject[ref.method]
      }, ref));
    });
    context.state.components[params.component_uid].actions = actions;

    return [states.COMPONENTS_ONE(params.component_uid)];
  },

  /**
   * 一件削除します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @return {Array}
   */
  removeOne: (context, component_uid) => {
    delete context.state.components[component_uid];
    return [states.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 全件削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.components = {};
    return [states.COMPONENTS];
  }
};
