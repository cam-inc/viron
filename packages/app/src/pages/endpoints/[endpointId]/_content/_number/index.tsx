import React, { useEffect, useState } from 'react';
import { Endpoint } from '$types/index';
import { ContentGetResponseOfTypeOfNumber, Document, Info } from '$types/oas';
import { fetchContentData } from '$utils/oas';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _ContentNumber: React.FC<Props> = ({ endpoint, document, content }) => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<ContentGetResponseOfTypeOfNumber>();

  useEffect(function () {
    const f = async function (): Promise<void> {
      const [response, responseError] = await fetchContentData(
        endpoint,
        document,
        content.getOperationId
      );
      if (!!responseError) {
        // Network error.
        setError(responseError.message);
        setIsPending(false);
        return;
      }
      if (!response.ok) {
        // The token is not valid.
        setError(`${response.status}: ${response.statusText}`);
        setIsPending(false);
        return;
      }
      const data: ContentGetResponseOfTypeOfNumber = await response.json();
      setData(data);
      setIsPending(false);
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending) {
    return <p>fetching data...</p>;
  }

  if (!!error) {
    return <p>error: {error}</p>;
  }

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};
export default _ContentNumber;
