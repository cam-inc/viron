import React, { PropsWithChildren } from 'react';
import { HSL } from '~/types';
import { Mode } from '~/utils/colorSystem';

export type Props = {
  title: string;
  mode: Mode;
};
const _Mode: React.FC<Props> = ({ title, mode }) => {
  return (
    <div>
      <div className="text-[#fff] text-xxs mb-1">{title}</div>
      <div className="grid grid-cols-3 gap-1 rounded overflow-hidden">
        <div>
          <Chip
            title="Primary"
            ground={mode.primary}
            on={mode.onPrimary}
            onHigh={mode.onPrimaryHigh}
            onLow={mode.onPrimaryLow}
            onSlight={mode.onPrimarySlight}
            onFaint={mode.onPrimaryFaint}
          />
          <Chip
            title="Container"
            ground={mode.primaryContainer}
            on={mode.onPrimaryContainer}
            onHigh={mode.onPrimaryContainerHigh}
            onLow={mode.onPrimaryContainerLow}
            onSlight={mode.onPrimaryContainerSlight}
            onFaint={mode.onPrimaryContainerFaint}
          />
        </div>
        <div>
          <Chip
            title="Secondary"
            ground={mode.secondary}
            on={mode.onSecondary}
            onHigh={mode.onSecondaryHigh}
            onLow={mode.onSecondaryLow}
            onSlight={mode.onSecondarySlight}
            onFaint={mode.onSecondaryFaint}
          />
          <Chip
            title="Container"
            ground={mode.secondaryContainer}
            on={mode.onSecondaryContainer}
            onHigh={mode.onSecondaryContainerHigh}
            onLow={mode.onSecondaryContainerLow}
            onSlight={mode.onSecondaryContainerSlight}
            onFaint={mode.onSecondaryContainerFaint}
          />
        </div>
        <div>
          <Chip
            title="Tertiary"
            ground={mode.tertiary}
            on={mode.onTertiary}
            onHigh={mode.onTertiaryHigh}
            onLow={mode.onTertiaryLow}
            onSlight={mode.onTertiarySlight}
            onFaint={mode.onTertiaryFaint}
          />
          <Chip
            title="Container"
            ground={mode.tertiaryContainer}
            on={mode.onTertiaryContainer}
            onHigh={mode.onTertiaryContainerHigh}
            onLow={mode.onTertiaryContainerLow}
            onSlight={mode.onTertiaryContainerSlight}
            onFaint={mode.onTertiaryContainerFaint}
          />
        </div>
        <div>
          <Chip
            title="Error"
            ground={mode.error}
            on={mode.onError}
            onHigh={mode.onErrorHigh}
            onLow={mode.onErrorLow}
            onSlight={mode.onErrorSlight}
            onFaint={mode.onErrorFaint}
          />
          <Chip
            title="Error Container"
            ground={mode.errorContainer}
            on={mode.onErrorContainer}
            onHigh={mode.onErrorContainerHigh}
            onLow={mode.onErrorContainerLow}
            onSlight={mode.onErrorContainerSlight}
            onFaint={mode.onErrorContainerFaint}
          />
        </div>
        <Chip
          title="Background"
          ground={mode.background}
          on={mode.onBackground}
          onHigh={mode.onBackgroundHigh}
          onLow={mode.onBackgroundLow}
          onSlight={mode.onBackgroundSlight}
          onFaint={mode.onBackgroundFaint}
        >
          <div className="mb-2">
            <Chip
              title="Surface"
              ground={mode.surface}
              on={mode.onSurface}
              onHigh={mode.onSurfaceHigh}
              onLow={mode.onSurfaceLow}
              onSlight={mode.onSurfaceSlight}
              onFaint={mode.onSurfaceFaint}
            />
          </div>
          <Chip
            title="Surface Variant"
            ground={mode.surfaceVariant}
            on={mode.onSurfaceVariant}
            onHigh={mode.onSurfaceVariantHigh}
            onLow={mode.onSurfaceVariantLow}
            onSlight={mode.onSurfaceVariantSlight}
            onFaint={mode.onSurfaceVariantFaint}
          />
        </Chip>
      </div>
    </div>
  );
};
export default _Mode;

const Chip: React.FC<
  PropsWithChildren<{
    title: string;
    ground: HSL;
    on: HSL;
    onHigh: HSL;
    onLow: HSL;
    onSlight: HSL;
    onFaint: HSL;
  }>
> = ({ title, ground, on, onHigh, onLow, onSlight, onFaint, children }) => {
  return (
    <div
      className="p-2"
      style={{
        backgroundColor: `hsl(${ground.h}, ${ground.s}%, ${ground.l}%)`,
      }}
    >
      <div
        className="text-xs font-bold mb-2"
        style={{ color: `hsl(${on.h}, ${on.s}%, ${on.l}%)` }}
      >
        {title}
      </div>
      <div className="grid grid-cols-3 gap-1 text-xxs">
        <div>
          <div
            style={{ color: `hsl(${onHigh.h}, ${onHigh.s}%, ${onHigh.l}%)` }}
          >
            on high
          </div>
          <div
            className="h-1"
            style={{
              backgroundColor: `hsl(${onHigh.h}, ${onHigh.s}%, ${onHigh.l}%)`,
            }}
          />
        </div>
        <div>
          <div style={{ color: `hsl(${on.h}, ${on.s}%, ${on.l}%)` }}>on</div>
          <div
            className="h-1"
            style={{ backgroundColor: `hsl(${on.h}, ${on.s}%, ${on.l}%)` }}
          />
        </div>
        <div>
          <div style={{ color: `hsl(${onLow.h}, ${onLow.s}%, ${onLow.l}%)` }}>
            on low
          </div>
          <div
            className="h-1"
            style={{
              backgroundColor: `hsl(${onLow.h}, ${onLow.s}%, ${onLow.l}%)`,
            }}
          />
        </div>
        <div>
          <div
            style={{
              color: `hsl(${onSlight.h}, ${onSlight.s}%, ${onSlight.l}%)`,
            }}
          >
            on slight
          </div>
          <div
            className="h-1"
            style={{
              backgroundColor: `hsl(${onSlight.h}, ${onSlight.s}%, ${onSlight.l}%)`,
            }}
          />
        </div>
        <div>
          <div
            style={{ color: `hsl(${onFaint.h}, ${onFaint.s}%, ${onFaint.l}%)` }}
          >
            on faint
          </div>
          <div
            className="h-1"
            style={{
              backgroundColor: `hsl(${onFaint.h}, ${onFaint.s}%, ${onFaint.l}%)`,
            }}
          />
        </div>
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};
