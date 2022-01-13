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
    onPrimaryHigh,
    onPrimaryLow,
    secondary,
    background,
    onBackground,
    onBackgroundHigh,
    onBackgroundLow,
    surface,
    onSurface,
    onSurfaceHigh,
    onSurfaceLow,
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
              backgroundColor: hsl(primary),
            }}
          >
            <div className="p-2 flex gap-2 items-center">
              <div
                style={{
                  color: hsl(onPrimaryHigh),
                }}
              >
                on primary high
              </div>
              <div
                style={{
                  color: hsl(onPrimary),
                }}
              >
                on primary
              </div>
              <div
                style={{
                  color: hsl(onPrimaryLow),
                }}
              >
                on primary low
              </div>
            </div>
          </div>
          <div className="relative pl-16 h-[240px] z-layout-body">
            <div className="p-2">
              <div
                style={{
                  color: hsl(onBackgroundHigh),
                }}
              >
                on background high
              </div>
              <div
                style={{
                  color: hsl(onBackground),
                }}
              >
                on background
              </div>
              <div
                style={{
                  color: hsl(onBackgroundLow),
                }}
              >
                on background low
              </div>
              <div
                className="p-2 mt-2 rounded"
                style={{
                  backgroundColor: hsl(surface),
                }}
              >
                <div
                  style={{
                    color: hsl(onSurfaceHigh),
                  }}
                >
                  on surface high
                </div>
                <div
                  style={{
                    color: hsl(onSurface),
                  }}
                >
                  on surface high
                </div>
                <div
                  style={{
                    color: hsl(onSurfaceLow),
                  }}
                >
                  on surface low
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-2 left-0 bottom-0 w-16 z-layout-navigation">
            <div
              className="h-full p-2"
              style={{
                backgroundColor: hsl(surface),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
