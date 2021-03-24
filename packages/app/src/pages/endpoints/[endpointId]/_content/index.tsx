import React from 'react';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import _ContentNumber from './_number/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
};
const _Content: React.FC<Props> = ({ endpoint, document, content }) => {
  let elm: JSX.Element | null;
  switch (content.type) {
    case 'number':
      elm = (
        <_ContentNumber
          endpoint={endpoint}
          document={document}
          content={content}
        />
      );
      break;
    default:
      elm = null;
      break;
  }

  return (
    <div>
      <p>{content.title}</p>
      <div>{elm}</div>
    </div>
  );
};
export default _Content;
