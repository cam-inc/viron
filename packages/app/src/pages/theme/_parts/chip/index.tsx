import React from 'react';
import { HEX } from '../_types/index';

type Props = {
  surface: HEX;
  on?: HEX;
};
const Chip: React.FC<Props> = ({ surface, on }) => {
  return (
    <div
      className="flex justify-center items-center w-8 h-8"
      style={{ backgroundColor: surface }}
    >
      {on && (
        <p className="text-xs" style={{ color: on }}>
          Aa
        </p>
      )}
    </div>
  );
};
export default Chip;
