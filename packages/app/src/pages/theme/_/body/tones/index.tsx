import React from 'react';
import { Tone as ToneType } from '~/utils/colorSystem';
import Tone from '../tone';

export type Props = { title: string; list: ToneType[] };
const Tones: React.FC<Props> = ({ title, list }) => {
  return (
    <div>
      <div className="text-[#fff] text-xxs mb-1">{title}</div>
      <ul className="flex">
        {list.map((tone, idx) => (
          <li key={idx} className="flex-1">
            <Tone {...tone} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Tones;
