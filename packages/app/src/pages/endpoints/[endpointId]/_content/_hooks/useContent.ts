import _ from 'lodash';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Endpoint } from '$types/index';
import {
  Document,
  Info,
  Request,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
  RequestValue,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
} from '$utils/oas';
import useAutoRefresh, { UseAutoRefreshReturn } from './useAutoRefresh';
import useBase, { UseBaseReturn } from './useBase';
import useRelated, { UseRelatedReturn } from './useRelated';
import useRelatedDescendant, {
  UseRelatedDescendantReturn,
} from './useRelatedDescendant';

const useContent = function (
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): {
  base: UseBaseReturn;
  related: UseRelatedReturn;
  relatedDescendant: UseRelatedDescendantReturn;
  autoRefresh: UseAutoRefreshReturn;
} {
  const base = useBase(endpoint, document, content);
  const related = useRelated(document, content);
  const relatedDescendant = useRelatedDescendant(document, content);
  const autoRefresh = useAutoRefresh(content);

  return {
    base,
    related,
    relatedDescendant,
    autoRefresh,
  };
};

export default useContent;
