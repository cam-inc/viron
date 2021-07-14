import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';
import React from 'react';
import Button from '$components/button';
import { ON } from '$constants/index';
import { UseBaseReturn } from '../../_hooks/useBase';

type Props = {
  base: UseBaseReturn;
};
const Refresh: React.FC<Props> = ({ base }) => {
  const handleClick = function () {
    base.refresh();
  };

  return (
    <Button
      on={ON.SURFACE}
      variant="text"
      Icon={AiOutlineReload}
      onClick={handleClick}
    />
  );
};
export default Refresh;
