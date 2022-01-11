import React, { useCallback } from 'react';
import { HSL } from '~/types';
import { Mode, ModeName, MODE_NAME, Tokens } from '~/utils/colorSystem';

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
    background,
    onBackground,
    surface,
    onSurface,
  } = mode;
  const hsl = useCallback(({ h, s, l }: HSL) => `hsl(${h}, ${s}%, ${l}%)`, []);
  return (
    <div>
      <div className="text-thm-on-background text-xs mb-2 ">{title}</div>
      <div className="rounded overflow-hidden border-2 border-thm-on-background">
        <div
          className="relative text-xxs"
          style={{
            backgroundColor: hsl(background),
          }}
        >
          <div
            className="relative h-2 shadow-01dp z-layout-systembar"
            style={{
              backgroundColor: hsl(secondary),
            }}
          />
          <div
            className="relative pl-16 h-8 shadow-01dp z-layout-appbar"
            style={{
              color: hsl(onPrimary),
              backgroundColor: hsl(primary),
            }}
          >
            appbar
          </div>
          <div className="relative pl-16 h-[240px] z-layout-body">
            <div
              className="p-2"
              style={{
                color: hsl(onBackground),
              }}
            >
              on background
            </div>
          </div>
          <div className="absolute top-2 left-0 bottom-0 w-16 z-layout-navigation">
            <div
              className="h-full"
              style={{
                color: hsl(onSurface),
                backgroundColor: hsl(surface),
              }}
            >
              on background
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
