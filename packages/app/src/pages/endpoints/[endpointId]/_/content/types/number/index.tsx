import React from 'react';
import Error from '@/components/error';
import { Document, Content } from '@/types/oas';
import { validateResponseDataOfTypeNumber } from '@/utils/oas/content';
import { UseBaseReturn } from '../../hooks/useBase';

type Props = {
  document: Document;
  content: Content;
  base: UseBaseReturn;
};
const ContentNumber: React.FC<Props> = ({ document, base }) => {
  const result = validateResponseDataOfTypeNumber(document, base.data);
  if (result.isFailure()) {
    return <Error error={result.value} />;
  }

  return (
    <div className="flex justify-end p-2">
      <div className="text-2xl font-bold">{result.value.toLocaleString()}</div>
    </div>
  );
};
export default ContentNumber;
