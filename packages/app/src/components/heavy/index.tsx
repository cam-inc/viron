import React from 'react';
import { Props as BaseProps } from '~/components';

export type Props = BaseProps;
const Heavy: React.FC<Props> = () => {
  return <p>This is veeeeeeeeeeeeeeeeeeery heavy compoent.(file size) </p>;
};
export default Heavy;
