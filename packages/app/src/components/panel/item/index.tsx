import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import React from 'react';

type Props<T> = {
  id: T;
  onCloseClick: (id: T) => void;
  children: React.ReactNode;
};

// Generic component in JSX/TS.
// @see: https://typescript-jp.gitbook.io/deep-dive/tsx/react#react-jsxnohinto-jenerikkukonpnento
// `extends Record<string, never>` is here so that the TS compiler recognize `<...>` as a generic not a JSX tag.
export type PanelItemType = <T extends Record<string, never>>(
  props: Props<T>
) => React.ReactElement | null;

const PanelItem: PanelItemType = function ({ id, onCloseClick, children }) {
  const handleCloseClick = function () {
    onCloseClick(id);
  };
  return (
    <div>
      <div>
        <button onClick={handleCloseClick}>
          <AiFillDelete />
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};
export default PanelItem;
