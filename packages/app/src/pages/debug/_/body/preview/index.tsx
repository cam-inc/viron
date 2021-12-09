import React, { useCallback } from 'react';
import { HSL } from '$types/index';
import { Mode, ModeName, MODE_NAME, Tokens } from '$utils/colorSystem';

export type Props = {
  tokens: Tokens;
};
const Preview: React.FC<Props> = ({ tokens }) => {
  return (
    <ul className="flex gap-2">
      <li className="flex-1">
        <_Preview
          title={MODE_NAME.LIGHT}
          mode={tokens.modes[MODE_NAME.LIGHT]}
        />
      </li>
      <li className="flex-1">
        <_Preview title={MODE_NAME.DARK} mode={tokens.modes[MODE_NAME.DARK]} />
      </li>
    </ul>
  );
};
export default Preview;

const _Preview: React.FC<{
  title: ModeName;
  mode: Mode;
}> = ({ title, mode }) => {
  const {
    primary,
    onPrimary,
    secondary,
    onSecondary,
    background,
    onBackground,
  } = mode;
  const hsl = useCallback(({ h, s, l }: HSL) => `hsl(${h}, ${s}%, ${l}%)`, []);
  return (
    <div>
      <div className="text-thm-on-background text-xxs mb-2 ">{title}</div>
      <div className="rounded overflow-hidden border-2 border-thm-on-background">
        <div
          className="text-xxs"
          style={{
            backgroundColor: hsl(background),
          }}
        >
          <div
            className="p-2"
            style={{
              color: hsl(onPrimary),
              backgroundColor: hsl(primary),
            }}
          >
            appbar
          </div>
          <div className="p-2">
            <div
              className=""
              style={{
                color: hsl(onBackground),
              }}
            >
              on background
            </div>
          </div>
          <div
            className="p-2"
            style={{
              color: hsl(onSecondary),
              backgroundColor: hsl(secondary),
            }}
          >
            footer
          </div>
        </div>
      </div>
    </div>
  );
};
