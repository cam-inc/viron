import _ from 'lodash';
import { useMemo } from 'react';
import { Document, Info, Method, OperationId } from '$types/oas';
import {
  getContentBaseOperationResponseKeys,
  getPathItem,
  getRequest,
  getRequestParameterKeys,
} from '$utils/oas';

export type UseSiblingsReturn = {
  operationIds: OperationId[];
};
// Sibling Opeartions are
// [1] operations whose path is the same as the base operation's one but method is different.
// [2] action operations whose request payload key set doesn't contain one of base operation's response payload keys.
const useSiblings = function (
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseSiblingsReturn {
  const operationIds = useMemo<OperationId[]>(function () {
    const _operationIds: OperationId[] = [];
    const baseRequest = getRequest(document, {
      operationId: content.operationId,
    });
    if (!baseRequest) {
      return _operationIds;
    }
    const basePathItem = getPathItem(document, baseRequest.path);
    if (!basePathItem) {
      return _operationIds;
    }

    // Add operations under the rule of [1] described above.
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
      if (method === baseRequest.method) {
        return;
      }
      const operationId = basePathItem[method]?.operationId;
      if (!operationId) {
        return;
      }
      _operationIds.push(operationId);
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
            .length === 0
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
export default useSiblings;
