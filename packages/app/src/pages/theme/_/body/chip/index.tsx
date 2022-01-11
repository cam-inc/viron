import React from 'react';

export type Props = {
  title: string;
  name: string;
};
const Chip: React.FC<Props> = ({ title, name }) => {
  return (
    <div className="relative h-16">
      <div className="top-[8px] left-[8px]">{title}</div>
      <div className="bottom-[8px] right-[8px]">{name}</div>
    </div>
  );
};
export default Chip;
