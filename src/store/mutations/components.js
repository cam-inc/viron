import filter from 'mout/array/filter';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import isNumber from 'mout/lang/isNumber';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

export default exporter('components', {
  /**
   * 一件更新します。
   * @param {Object} state
   * @param {String} componentId
   * @param {Object} componentDef
   * @param {*} response
   * @param {Response.Headers} headers
   * @return {Array}
   */
  updateOne: (state, componentId, componentDef, response, headers) => {
    state.components[componentId] = {
      def: componentDef,
      response
    };
    const method = componentDef.api.method;
    const path = componentDef.api.path;
    const queries = componentDef.query;
    // 検索用パラメータ群。
    const parameters = state.oas.client.spec.paths[path][method].parameters || [];
    state.components[componentId]['searchParameters'] = filter(parameters, parameter => {
      if (parameter.in !== 'query') {
        return false;
      }
      if (!find(queries, query => {
        return (query.key === parameter.name);
      })) {
        return false;
      }
      return true;
    });
    // ページング機能ONの場合。
    if (componentDef.pagination) {
      state.components[componentId]['pagination'] = {
        current: Number(headers['x-pagination-current-page'] || 0),
        size: Number(headers['x-pagination-limit'] || 0),
        max: Number(headers['x-pagination-total-pages'] || 0)
      };
    }
    // 自動更新機能ONの場合。
    if (isNumber(componentDef.auto_refresh_sec)) {
      state.components[componentId]['autoRefreshSec'] = componentDef.auto_refresh_sec;
    }
    // styleがテーブルの場合。
    if (componentDef.style === 'table') {
      // テーブルのカラム情報を付与します。
      const properties = state.oas.client.spec.paths[path][method].responses[200].schema.items.properties;
      const columns = [];
      forOwn(properties, (property, key) => {
        columns.push(ObjectAssign({
          key
        }, property));
      });
      state.components[componentId]['columns'] = columns;
      // テーブル/行に対するアクションを付与します。
      const tableOperations = [];
      const rowOperations = [];
      // 同じpath & method違いのoperationObjectは関連有りとみなす。
      // `get`はcomponent自身なのでスルーする。
      forEach(['put', 'post', 'delete'], method => {
        const operationObject = !!state.oas.client.spec.paths[path] && state.oas.client.spec.paths[path][method];
        if (!operationObject) {
          return;
        }
        tableOperations.push(ObjectAssign({
          method,
          path
        }, operationObject));
      });
      // primaryキーが存在する場合、`basePath/primaryKey`の各operationObjectは関連有りとみなす。
      // テーブルの各rowに紐づくOperationObjectとみなす。
      const primary = componentDef.primary;
      state.components[componentId]['primary'] = primary;
      if (!!primary) {
        forEach(['get', 'put', 'post', 'delete'], method => {
          const operationObject = !!state.oas.client.spec.paths[`${path}/{${primary}}`] && state.oas.client.spec.paths[`${path}/{${primary}}`][method];
          if (!operationObject) {
            return;
          }
          rowOperations.push(ObjectAssign({
            method,
            path: `${path}/{${primary}}`
          }, operationObject));
        });
      }
      // actionsに指定されたpath群のOperationObjectも関連有りとみなします。
      // path内にprimaryKeyと同一名の変数があれば、それはテーブルrowに紐づくOperationObjectとみなします。
      // primaryKeyと同一名の変数が無ければ、テーブルと紐づくOperationObjectとみなします。
      forEach(componentDef.actions || [], action => {
        const isRowRelated = (action.indexOf(`{${primary}}`) >= 0);
        forEach(['get', 'put', 'post', 'delete'], method => {
          const operationObject = !!state.oas.client.spec.paths[action] && state.oas.client.spec.paths[action][method];
          if (!operationObject) {
            return;
          }
          let target;
          if (isRowRelated) {
            target = rowOperations;
          } else {
            target = tableOperations;
          }
          target.push(ObjectAssign({
            method,
            path: action
          }, operationObject));
        });
      });
      // プレビューも関連有りとみなす。
      if (!!componentDef.preview) {
        (() => {
          const path = componentDef.preview.path;
          const method = componentDef.preview.method;
          if (!path || !method) {
            return;
          }
          const operationObject = !!state.oas.client.spec.paths[path] && state.oas.client.spec.paths[path][method];
          if (!operationObject) {
            return;
          }
          rowOperations.push(ObjectAssign({
            method,
            path,
            isPreview: true,
            target: componentDef.preview.target
          }, operationObject));
        })();
      }
      state.components[componentId]['tableOperations'] = tableOperations;
      state.components[componentId]['rowOperations'] = rowOperations;
    }
    // styleがギャラリーの場合。
    if (componentDef.style === 'explorer') {
      const explorerOperations = [];
      // 同じpath & post methodのoperationObjectは関連有りとみなす。
      !!state.oas.client.spec.paths[path] && state.oas.client.spec.paths[path]['post'] && (explorerOperations.push(ObjectAssign({
        method: 'post',
        path
      }, state.oas.client.spec.paths[path]['post'])));
      !!state.oas.client.spec.paths[`${path}/{id}`] && state.oas.client.spec.paths[`${path}/{id}`]['delete'] && (explorerOperations.push(ObjectAssign({
        method: 'delete',
        path
      }, state.oas.client.spec.paths[`${path}/{id}`]['delete'])));
      state.components[componentId]['explorerOperations'] = explorerOperations;
    }

    const operations = [];
    forEach(['get', 'put', 'post', 'delete'], method => {
      const operationObject = !!state.oas.client.spec.paths[`${path}`] && state.oas.client.spec.paths[`${path}`][method];
      if (!operationObject) {
        return;
      }
      operations.push(ObjectAssign({
        method,
        path
      }, operationObject));
    });
    state.components[componentId]['operations'] = operations;
    // primaryキーが存在する場合、`basePath/primaryKey`の各operationObjectは関連有りとみなす。
    const itemOperations = [];
    const primary = componentDef.primary;
    if (!!primary) {
      state.components[componentId]['primary'] = primary;
      forEach(['get', 'put', 'post', 'delete'], method => {
        const operationObject = !!state.oas.client.spec.paths[`${path}/{${primary}}`] && state.oas.client.spec.paths[`${path}/{${primary}}`][method];
        if (!operationObject) {
          return;
        }
        itemOperations.push(ObjectAssign({
          method,
          path: `${path}/{${primary}}`
        }, operationObject));
      });
    }
    state.components[componentId]['itemOperations'] = itemOperations;

    return ['components', componentId];
  },

  /**
   * 一件削除します。
   * @param {Object} state
   * @param {String} componentId
   * @return {Array}
   */
  removeOne: (state, componentId) => {
    delete state.components[componentId];
    return ['components', componentId];
  },

  /**
   * 全件削除します。
   * @param {Object} state
   * @return {Array}
   */
  removeAll: state => {
    state.components = {};
    return ['components'];
  }
});
