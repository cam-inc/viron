import _ from 'lodash';
import { useMemo } from 'react';
import { Document, Info, Method, OperationId } from '$types/oas';
import {
  getContentBaseOperationResponseKeys,
  getRequest,
  getRequestParameterKeys,
} from '$utils/oas';

export type UseDescendantsReturn = {
  operationIds: OperationId[];
};
// Descendant Opeartions are
// [1] operations whose path includes base operation's one at the head.(i.e. path matches `/${baseOperation's path}/xxx/yyy`)
// [2] action operations whose request payload key set contains one of base operation's response payload keys.
const useDescendants = function (
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseDescendantsReturn {
  const operationIds = useMemo<OperationId[]>(function () {
    const _operationIds: OperationId[] = [];
    const baseRequest = getRequest(document, {
      operationId: content.operationId,
    });
    if (!baseRequest) {
      return _operationIds;
    }

    // Add operations under the rule of [1] described above.
    const pathItems = _.filter(document.paths, function (_, path) {
      return path !== baseRequest.path && path.indexOf(baseRequest.path) === 0;
    });
    _.each(pathItems, function (pathItem) {
      // TODO: method一覧の扱い改善。
      (
        [
          'get',
          'put',
          'post',
          'delete',
          'options',
          'head',
          'patch',
          'trace',
        ] as Method[]
      ).forEach(function (method) {
        const operationId = pathItem[method]?.operationId;
        if (!operationId) {
          return;
        }
        _operationIds.push(operationId);
      });
    });

    // Add operations under the rule of [2] described above.
    if (content.actions) {
      const baseOperationResponseKeys = getContentBaseOperationResponseKeys(
        document,
        content
      );
      content.actions.forEach(function (action) {
        const actionOperationRequestKeys = getRequestParameterKeys(
          document,
          action.operationId
        );
        if (
          _.intersection(baseOperationResponseKeys, actionOperationRequestKeys)
            .length
        ) {
          _operationIds.push(action.operationId);
        }
      });
    }

    return _operationIds;
  }, []);

  return {
    operationIds,
  };
};
export default useDescendants;
