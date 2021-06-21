import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';
import React from 'react';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  base: UseBaseReturn;
};
const Refresh: React.FC<Props> = ({ base }) => {
  const handleClick = function () {
    base.refresh();
  };

  return (
    <button onClick={handleClick}>
      <AiOutlineReload className="inline" />
      <span>refresh</span>
    </button>
  );
};
export default Refresh;
