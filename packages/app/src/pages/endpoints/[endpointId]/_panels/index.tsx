import React from 'react';
import Panel from '$components/panel';
import { Endpoint } from '$types/index';
import { Document, Info } from '$types/oas';
import _Content from '../_content/index';

type Props = {
  endpoint: Endpoint;
  document: Document;
  selectedPageIds: Info['x-pages'][number]['id'][];
  onUnselect: (pageId: Info['x-pages'][number]['id']) => void;
};
const _Panels: React.FC<Props> = ({
  endpoint,
  document,
  selectedPageIds,
  onUnselect,
}) => {
  const pages = document.info['x-pages'].filter((page) =>
    selectedPageIds.includes(page.id)
  );

  const handlePanelItemCloseClick = function (id: string) {
    onUnselect(id);
  };

  return (
    <Panel>
      {pages.map((page) => (
        <React.Fragment key={page.id}>
          <Panel.Item id={page.id} onCloseClick={handlePanelItemCloseClick}>
            <div>
              <p>{page.title}</p>
              <p>{page.description}</p>
              <ul>
                {page.contents.map((content, idx) => (
                  <React.Fragment key={idx}>
                    <_Content
                      endpoint={endpoint}
                      document={document}
                      content={content}
                    />
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </Panel.Item>
        </React.Fragment>
      ))}
    </Panel>
  );
};
export default _Panels;
