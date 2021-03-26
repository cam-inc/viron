import React, { useEffect } from 'react';
import { useFetch } from '$hooks/oas';
import { Endpoint } from '$types/index';
import { ContentGetResponseOfTypeOfNumber, Document, Info } from '$types/oas';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _ContentNumber: React.FC<Props> = ({ endpoint, document, content }) => {
  const {
    isPending,
    error,
    responseJson,
    fetch,
  } = useFetch<ContentGetResponseOfTypeOfNumber>(endpoint, document, {
    operationId: content.getOperationId,
  });

  useEffect(function () {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending) {
    return <p>fetching data...</p>;
  }

  if (!!error) {
    return <p>error: {error.message}</p>;
  }

  if (!responseJson) {
    return <p>no response.</p>;
  }

  return (
    <div>
      <p>{JSON.stringify(responseJson)}</p>
    </div>
  );
};
export default _ContentNumber;
