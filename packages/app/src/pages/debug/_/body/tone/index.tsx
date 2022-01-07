import classnames from 'classnames';
import React from 'react';
import { Tone } from '~/utils/colorSystem';

export type Props = Tone;
const _Tone: React.FC<Props> = ({ hsl, level }) => {
  const { h, s, l } = hsl;
  return (
    <div
      className={classnames('h-18 flex items-center justify-center text-xxs', {
        'text-[#fff]': level <= 50,
        'text-[#000]': 50 < level,
      })}
      style={{
        backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
      }}
    >
      {level}
    </div>
  );
};
export default _Tone;
