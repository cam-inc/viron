import forEach from 'mout/array/forEach';
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
   * @return {Array}
   */
  updateOne: (state, componentId, componentDef, response) => {
    state.components[componentId] = {
      def: componentDef,
      response
    };
    // styleがテーブルの場合。
    if (componentDef.style === 'table') {
      // テーブルのカラム情報を付与します。
      const method = componentDef.api.method;
      const path = componentDef.api.path;
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
      state.components[componentId]['tableOperations'] = tableOperations;
      state.components[componentId]['rowOperations'] = rowOperations;
    }
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
