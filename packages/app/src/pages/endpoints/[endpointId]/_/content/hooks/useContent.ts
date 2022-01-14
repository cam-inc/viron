import { useMemo } from 'react';
import { Endpoint } from '~/types';
import { Document, Info } from '~/types/oas';
import useBase, { UseBaseReturn } from './useBase';
import useSiblings, { UseSiblingsReturn } from './useSiblings';
import useDescendants, { UseDescendantsReturn } from './useDescendants';

export type UseContentReturn = {
  base: UseBaseReturn;
  siblings: UseSiblingsReturn;
  descendants: UseDescendantsReturn;
};
const useContent = (
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseContentReturn => {
  const base = useBase(endpoint, document, content);
  const siblings = useSiblings(endpoint, document, content);
  const descendants = useDescendants(endpoint, document, content);

  const ret = useMemo<UseContentReturn>(
    () => ({
      base,
      siblings,
      descendants,
    }),
    [base, siblings, descendants]
  );
  return ret;
};

export default useContent;
