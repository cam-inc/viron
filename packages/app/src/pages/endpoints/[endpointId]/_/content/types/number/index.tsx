import React from 'react';
import Error from '~/components/error';
import { COLOR_SYSTEM } from '~/types';
import { Document, Content } from '~/types/oas';
import { validateResponseDataOfTypeNumber } from '~/utils/oas/content';
import { UseBaseReturn } from '../../hooks/useBase';

type Props = {
  document: Document;
  content: Content;
  base: UseBaseReturn;
};
const ContentNumber: React.FC<Props> = ({ document, base }) => {
  const result = validateResponseDataOfTypeNumber(document, base.data);
  if (result.isFailure()) {
    return <Error on={COLOR_SYSTEM.SURFACE} error={result.value} />;
  }

  return (
    <div className="flex justify-end">
      <div className="text-2xl font-bold text-thm-on-surface">
        {result.value.toLocaleString()}
      </div>
    </div>
  );
};
export default ContentNumber;
