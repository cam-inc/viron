import React from 'react';
import Panel from '$components/panel';
import { Info } from '$types/oas';

type Props = {
  pages: Info['x-pages'];
  onUnselect: (pageId: Info['x-pages'][number]['id']) => void;
};
const _Panels: React.FC<Props> = ({ pages, onUnselect }) => {
  const handlePanelItemCloseClick = function (id: string) {
    onUnselect(id);
  };

  return (
    <Panel>
      {pages.map((page) => (
        <React.Fragment key={page.id}>
          <Panel.Item id={page.id} onCloseClick={handlePanelItemCloseClick}>
            {page.id}
          </Panel.Item>
        </React.Fragment>
      ))}
    </Panel>
  );
};
export default _Panels;
