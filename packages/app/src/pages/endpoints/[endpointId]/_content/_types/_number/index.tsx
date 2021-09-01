import React from 'react';
import Error from '$components/error';
import { ON } from '$constants/index';
import { Document, Info } from '$types/oas';
import { getNumber } from '$utils/oas';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  base: UseBaseReturn;
};
const _ContentNumber: React.FC<Props> = ({ base }) => {
  const result = getNumber(base.data);
  if (result.isFailure()) {
    return <Error on={ON.SURFACE} error={result.value} />;
  }

  return (
    <div className="flex justify-end">
      <div className="text-2xl font-bold text-on-surface">
        {result.value.toLocaleString()}
      </div>
    </div>
  );
};
export default _ContentNumber;
