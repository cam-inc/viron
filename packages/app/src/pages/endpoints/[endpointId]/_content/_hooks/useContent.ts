import _ from 'lodash';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
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
} {
  const base = useBase(endpoint, document, content);
  const related = useRelated(document, content);
  const relatedDescendant = useRelatedDescendant(document, content);

  return {
    base,
    related,
    relatedDescendant,
  };
};

export default useContent;
