import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import useBase, { UseBaseReturn } from './useBase';
import useSiblings, { UseSiblingsReturn } from './useSiblings';
import useDescendants, { UseDescendantsReturn } from './useDescendants';
import { Props as ContentProps } from '../index';

const useContent = function (
  endpoint: Endpoint,
  document: Document,
  contentId: ContentProps['contentId'],
  content: Info['x-pages'][number]['contents'][number]
): {
  base: UseBaseReturn;
  siblings: UseSiblingsReturn;
  descendants: UseDescendantsReturn;
} {
  const base = useBase(endpoint, document, contentId, content);
  const siblings = useSiblings(endpoint, document, content);
  const descendants = useDescendants(endpoint, document, content);

  return {
    base,
    siblings,
    descendants,
  };
};

export default useContent;
