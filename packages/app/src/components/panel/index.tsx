import React from 'react';
import PanelItem, { PanelItemType } from './item';

// Compound Component Pattern.
// @see: https://betterprogramming.pub/mastering-the-compound-component-pattern-cd0e56937fc3
const Panel: React.FC & { Item: PanelItemType } = ({ children }) => {
  return <div>{children}</div>;
};
Panel.Item = PanelItem;
export default Panel;
