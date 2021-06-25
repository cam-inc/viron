import _ from 'lodash';
import { PageProps } from 'gatsby';
import React, { useMemo, useState } from 'react';
import useTheme from '$hooks/theme';
import { isSSR } from '$utils/index';
import { DEPTH, LEVEL, MODE, PALETTE } from './_constants/index';
import Chip from './_parts/chip';
import Label from './_parts/label';
import { Palette } from './_types/index';
import {
  getBackground,
  getError,
  getOnBackground,
  getOnError,
  getOnBackgroundVariant,
  getOnPrimary,
  getOnPrimaryVariant,
  getOnSecondary,
  getOnSecondaryVariant,
  getOnSurface,
  getPrimary,
  getPrimaryVariant,
  getSecondary,
  getSecondaryVariant,
  getSurface,
  getSurfaceElevated,
} from './_utils/index';

type Props = PageProps;
const ThemePage: React.FC<Props> = () => {
  useTheme();

  const palettes = _.values(PALETTE);
  const [palette, setPalette] = useState<Palette>(palettes[0]);
  const handlePaletteChange = function (
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    setPalette(e.target.value as Palette);
  };

  const css = useMemo<string>(
    function () {
      return `
#root[data-theme="${palette}"] {
  /* Light */
  --color-background-l: ${getBackground(MODE.LIGHT)};
  --color-surface-l: ${getSurface(MODE.LIGHT, palette)};
  --color-surface-00dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['00']
  )};
  --color-surface-01dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['01']
  )};
  --color-surface-02dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['02']
  )};
  --color-surface-03dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['03']
  )};
  --color-surface-04dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['04']
  )};
  --color-surface-06dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['06']
  )};
  --color-surface-08dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['08']
  )};
  --color-surface-12dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['12']
  )};
  --color-surface-16dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['16']
  )};
  --color-surface-24dp-l: ${getSurfaceElevated(
    MODE.LIGHT,
    palette,
    DEPTH['24']
  )};
  --color-primary-l: ${getPrimary(MODE.LIGHT, palette)};
  --color-primary-variant-l: ${getPrimaryVariant(MODE.LIGHT, palette)};
  --color-secondary-l: ${getSecondary(MODE.LIGHT, palette)};
  --color-secondary-variant-l: ${getSecondaryVariant(MODE.LIGHT, palette)};
  --color-error-l: ${getError(MODE.LIGHT)};
  --color-on-background-l: ${getOnBackground(MODE.LIGHT)};
  --color-on-background-high-l: ${getOnBackground(MODE.LIGHT, LEVEL.HIGH)};
  --color-on-background-medium-l: ${getOnBackground(MODE.LIGHT, LEVEL.MEDIUM)};
  --color-on-background-disabled-l: ${getOnBackground(
    MODE.LIGHT,
    LEVEL.DISABLED
  )};
  --color-on-background-variant-l: ${getOnBackgroundVariant(
    MODE.LIGHT,
    palette
  )};
  --color-on-background-variant-high-l: ${getOnBackgroundVariant(
    MODE.LIGHT,
    palette,
    LEVEL.HIGH
  )};
  --color-on-background-variant-medium-l: ${getOnBackgroundVariant(
    MODE.LIGHT,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-background-variant-disabled-l: ${getOnBackgroundVariant(
    MODE.LIGHT,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-surface-l: ${getOnSurface(MODE.LIGHT, palette)};
  --color-on-surface-high-l: ${getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)};
  --color-on-surface-medium-l: ${getOnSurface(
    MODE.LIGHT,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-surface-disabled-l: ${getOnSurface(
    MODE.LIGHT,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-primary-l: ${getOnPrimary(MODE.LIGHT, palette)};
  --color-on-primary-high-l: ${getOnPrimary(MODE.LIGHT, palette, LEVEL.HIGH)};
  --color-on-primary-medium-l: ${getOnPrimary(
    MODE.LIGHT,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-primary-disabled-l: ${getOnPrimary(
    MODE.LIGHT,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-primary-variant-l: ${getOnPrimaryVariant(MODE.LIGHT, palette)};
  --color-on-primary-variant-high-l: ${getOnPrimaryVariant(
    MODE.LIGHT,
    palette,
    LEVEL.HIGH
  )};
  --color-on-primary-variant-medium-l: ${getOnPrimaryVariant(
    MODE.LIGHT,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-primary-variant-disabled-l: ${getOnPrimaryVariant(
    MODE.LIGHT,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-secondary-l: ${getOnSecondary(MODE.LIGHT, palette)};
  --color-on-secondary-high-l: ${getOnSecondary(
    MODE.LIGHT,
    palette,
    LEVEL.HIGH
  )};
  --color-on-secondary-medium-l: ${getOnSecondary(
    MODE.LIGHT,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-secondary-disabled-l: ${getOnSecondary(
    MODE.LIGHT,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-secondary-variant-l: ${getOnSecondaryVariant(MODE.LIGHT, palette)};
  --color-on-secondary-variant-high-l: ${getOnSecondaryVariant(
    MODE.LIGHT,
    palette,
    LEVEL.HIGH
  )};
  --color-on-secondary-variant-medium-l: ${getOnSecondaryVariant(
    MODE.LIGHT,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-secondary-variant-disabled-l: ${getOnSecondaryVariant(
    MODE.LIGHT,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-error-l: ${getOnError(MODE.LIGHT)};
  --color-on-error-high-l: ${getOnError(MODE.LIGHT, LEVEL.HIGH)};
  --color-on-error-medium-l: ${getOnError(MODE.LIGHT, LEVEL.MEDIUM)};
  --color-on-error-disabled-l: ${getOnError(MODE.LIGHT, LEVEL.DISABLED)};

  /* Dark */
  --color-background-d: ${getBackground(MODE.DARK)};
  --color-surface-d: ${getSurface(MODE.DARK, palette)};
  --color-surface-00dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['00']
  )};
  --color-surface-01dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['01']
  )};
  --color-surface-02dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['02']
  )};
  --color-surface-03dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['03']
  )};
  --color-surface-04dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['04']
  )};
  --color-surface-06dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['06']
  )};
  --color-surface-08dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['08']
  )};
  --color-surface-12dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['12']
  )};
  --color-surface-16dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['16']
  )};
  --color-surface-24dp-d: ${getSurfaceElevated(
    MODE.DARK,
    palette,
    DEPTH['24']
  )};
  --color-primary-d: ${getPrimary(MODE.DARK, palette)};
  --color-primary-variant-d: ${getPrimaryVariant(MODE.DARK, palette)};
  --color-secondary-d: ${getSecondary(MODE.DARK, palette)};
  --color-secondary-variant-d: ${getSecondaryVariant(MODE.DARK, palette)};
  --color-error-d: ${getError(MODE.DARK)};
  --color-on-background-d: ${getOnBackground(MODE.DARK)};
  --color-on-background-high-d: ${getOnBackground(MODE.DARK, LEVEL.HIGH)};
  --color-on-background-medium-d: ${getOnBackground(MODE.DARK, LEVEL.MEDIUM)};
  --color-on-background-disabled-d: ${getOnBackground(
    MODE.DARK,
    LEVEL.DISABLED
  )};
  --color-on-background-variant-d: ${getOnBackgroundVariant(
    MODE.DARK,
    palette
  )};
  --color-on-background-variant-high-d: ${getOnBackgroundVariant(
    MODE.DARK,
    palette,
    LEVEL.HIGH
  )};
  --color-on-background-variant-medium-d: ${getOnBackgroundVariant(
    MODE.DARK,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-background-variant-disabled-d: ${getOnBackgroundVariant(
    MODE.DARK,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-surface-d: ${getOnSurface(MODE.DARK, palette)};
  --color-on-surface-high-d: ${getOnSurface(MODE.DARK, palette, LEVEL.HIGH)};
  --color-on-surface-medium-d: ${getOnSurface(
    MODE.DARK,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-surface-disabled-d: ${getOnSurface(
    MODE.DARK,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-primary-d: ${getOnPrimary(MODE.DARK, palette)};
  --color-on-primary-high-d: ${getOnPrimary(MODE.DARK, palette, LEVEL.HIGH)};
  --color-on-primary-medium-d: ${getOnPrimary(
    MODE.DARK,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-primary-disabled-d: ${getOnPrimary(
    MODE.DARK,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-primary-variant-d: ${getOnPrimaryVariant(MODE.DARK, palette)};
  --color-on-primary-variant-high-d: ${getOnPrimaryVariant(
    MODE.DARK,
    palette,
    LEVEL.HIGH
  )};
  --color-on-primary-variant-medium-d: ${getOnPrimaryVariant(
    MODE.DARK,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-primary-variant-disabled-d: ${getOnPrimaryVariant(
    MODE.DARK,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-secondary-d: ${getOnSecondary(MODE.DARK, palette)};
  --color-on-secondary-high-d: ${getOnSecondary(
    MODE.DARK,
    palette,
    LEVEL.HIGH
  )};
  --color-on-secondary-medium-d: ${getOnSecondary(
    MODE.DARK,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-secondary-disabled-d: ${getOnSecondary(
    MODE.DARK,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-secondary-variant-d: ${getOnSecondaryVariant(MODE.DARK, palette)};
  --color-on-secondary-variant-high-d: ${getOnSecondaryVariant(
    MODE.DARK,
    palette,
    LEVEL.HIGH
  )};
  --color-on-secondary-variant-medium-d: ${getOnSecondaryVariant(
    MODE.DARK,
    palette,
    LEVEL.MEDIUM
  )};
  --color-on-secondary-variant-disabled-d: ${getOnSecondaryVariant(
    MODE.DARK,
    palette,
    LEVEL.DISABLED
  )};
  --color-on-error-d: ${getOnError(MODE.DARK)};
  --color-on-error-high-d: ${getOnError(MODE.DARK, LEVEL.HIGH)};
  --color-on-error-medium-d: ${getOnError(MODE.DARK, LEVEL.MEDIUM)};
  --color-on-error-disabled-d: ${getOnError(MODE.DARK, LEVEL.DISABLED)};
}
`;
    },
    [palette]
  );

  if (isSSR) {
    return null;
  }

  return (
    <div className="p-8">
      <div>
        <select onChange={handlePaletteChange}>
          {palettes.map(function (p) {
            return (
              <option key={p} value={p}>
                {p}
              </option>
            );
          })}
        </select>
      </div>
      <pre className="p-4">{css}</pre>
      <div className="flex">
        <div className="mr-8">
          <p>Light</p>
          <div className="pl-2">
            <Label value="background" />
            <Chip surface={getBackground(MODE.LIGHT)} />
            <Label value="on background" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackground(MODE.LIGHT)}
            />
            <Label value="on background high" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackground(MODE.LIGHT, LEVEL.HIGH)}
            />
            <Label value="on background medium" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackground(MODE.LIGHT, LEVEL.MEDIUM)}
            />
            <Label value="on background disabled" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackground(MODE.LIGHT, LEVEL.DISABLED)}
            />
            <Label value="on background variant" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackgroundVariant(MODE.LIGHT, palette)}
            />
            <Label value="on background variant high" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackgroundVariant(MODE.LIGHT, palette, LEVEL.HIGH)}
            />
            <Label value="on background variant medium" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackgroundVariant(MODE.LIGHT, palette, LEVEL.MEDIUM)}
            />
            <Label value="on background variant disabled" />
            <Chip
              surface={getBackground(MODE.LIGHT)}
              on={getOnBackgroundVariant(MODE.LIGHT, palette, LEVEL.DISABLED)}
            />

            <Label value="surface" />
            <Chip surface={getSurface(MODE.LIGHT, palette)} />
            <Label value="on surface" />
            <Chip
              surface={getSurface(MODE.LIGHT, palette)}
              on={getOnSurface(MODE.LIGHT, palette)}
            />
            <Label value="on surface high" />
            <Chip
              surface={getSurface(MODE.LIGHT, palette)}
              on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
            />
            <Label value="on surface medium" />
            <Chip
              surface={getSurface(MODE.LIGHT, palette)}
              on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
            />
            <Label value="on surface disabled" />
            <Chip
              surface={getSurface(MODE.LIGHT, palette)}
              on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
            />

            <Label value="elevation" />
            <div className="flex mb-1">
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['00'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['01'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['02'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['03'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['04'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['06'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['08'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['12'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['16'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['24'])}
              />
            </div>
            <div className="flex mb-1">
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['00'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['01'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['02'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['03'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['04'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['06'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['08'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['12'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['16'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['24'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.HIGH)}
              />
            </div>
            <div className="flex mb-1">
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['00'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['01'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['02'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['03'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['04'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['06'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['08'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['12'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['16'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['24'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.MEDIUM)}
              />
            </div>
            <div className="flex">
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['00'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['01'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['02'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['03'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['04'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['06'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['08'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['12'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['16'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.LIGHT, palette, DEPTH['24'])}
                on={getOnSurface(MODE.LIGHT, palette, LEVEL.DISABLED)}
              />
            </div>

            <Label value="primary" />
            <Chip surface={getPrimary(MODE.LIGHT, palette)} />
            <Label value="on primary" />
            <Chip
              surface={getPrimary(MODE.LIGHT, palette)}
              on={getOnPrimary(MODE.LIGHT, palette)}
            />
            <Label value="on primary high" />
            <Chip
              surface={getPrimary(MODE.LIGHT, palette)}
              on={getOnPrimary(MODE.LIGHT, palette, LEVEL.HIGH)}
            />
            <Label value="on primary medium" />
            <Chip
              surface={getPrimary(MODE.LIGHT, palette)}
              on={getOnPrimary(MODE.LIGHT, palette, LEVEL.MEDIUM)}
            />
            <Label value="on primary disabled" />
            <Chip
              surface={getPrimary(MODE.LIGHT, palette)}
              on={getOnPrimary(MODE.LIGHT, palette, LEVEL.DISABLED)}
            />

            <Label value="primary variant" />
            <Chip surface={getPrimaryVariant(MODE.LIGHT, palette)} />
            <Label value="on primary variant" />
            <Chip
              surface={getPrimaryVariant(MODE.LIGHT, palette)}
              on={getOnPrimaryVariant(MODE.LIGHT, palette)}
            />
            <Label value="on primary high" />
            <Chip
              surface={getPrimaryVariant(MODE.LIGHT, palette)}
              on={getOnPrimaryVariant(MODE.LIGHT, palette, LEVEL.HIGH)}
            />
            <Label value="on primary medium" />
            <Chip
              surface={getPrimaryVariant(MODE.LIGHT, palette)}
              on={getOnPrimaryVariant(MODE.LIGHT, palette, LEVEL.MEDIUM)}
            />
            <Label value="on primary disabled" />
            <Chip
              surface={getPrimaryVariant(MODE.LIGHT, palette)}
              on={getOnPrimaryVariant(MODE.LIGHT, palette, LEVEL.DISABLED)}
            />

            <Label value="secondary" />
            <Chip surface={getSecondary(MODE.LIGHT, palette)} />
            <Label value="on secondary" />
            <Chip
              surface={getSecondary(MODE.LIGHT, palette)}
              on={getOnSecondary(MODE.LIGHT, palette)}
            />
            <Label value="on secondary high" />
            <Chip
              surface={getSecondary(MODE.LIGHT, palette)}
              on={getOnSecondary(MODE.LIGHT, palette, LEVEL.HIGH)}
            />
            <Label value="on secondary medium" />
            <Chip
              surface={getSecondary(MODE.LIGHT, palette)}
              on={getOnSecondary(MODE.LIGHT, palette, LEVEL.MEDIUM)}
            />
            <Label value="on secondary disabled" />
            <Chip
              surface={getSecondary(MODE.LIGHT, palette)}
              on={getOnSecondary(MODE.LIGHT, palette, LEVEL.DISABLED)}
            />

            <Label value="secondary variant" />
            <Chip surface={getSecondaryVariant(MODE.LIGHT, palette)} />
            <Label value="on secondary variant" />
            <Chip
              surface={getSecondaryVariant(MODE.LIGHT, palette)}
              on={getOnSecondaryVariant(MODE.LIGHT, palette)}
            />
            <Label value="on secondary high" />
            <Chip
              surface={getSecondaryVariant(MODE.LIGHT, palette)}
              on={getOnSecondaryVariant(MODE.LIGHT, palette, LEVEL.HIGH)}
            />
            <Label value="on secondary medium" />
            <Chip
              surface={getSecondaryVariant(MODE.LIGHT, palette)}
              on={getOnSecondaryVariant(MODE.LIGHT, palette, LEVEL.MEDIUM)}
            />
            <Label value="on secondary disabled" />
            <Chip
              surface={getSecondaryVariant(MODE.LIGHT, palette)}
              on={getOnSecondaryVariant(MODE.LIGHT, palette, LEVEL.DISABLED)}
            />

            <Label value="error" />
            <Chip surface={getError(MODE.LIGHT)} />
            <Label value="on error" />
            <Chip surface={getError(MODE.LIGHT)} on={getOnError(MODE.LIGHT)} />
            <Label value="on error high" />
            <Chip
              surface={getError(MODE.LIGHT)}
              on={getOnError(MODE.LIGHT, LEVEL.HIGH)}
            />
            <Label value="on error medium" />
            <Chip
              surface={getError(MODE.LIGHT)}
              on={getOnError(MODE.LIGHT, LEVEL.MEDIUM)}
            />
            <Label value="on error disabled" />
            <Chip
              surface={getError(MODE.LIGHT)}
              on={getOnError(MODE.LIGHT, LEVEL.DISABLED)}
            />
          </div>
        </div>

        <div>
          <p>Dark</p>
          <div className="pl-2">
            <Label value="background" />
            <Chip surface={getBackground(MODE.DARK)} />
            <Label value="on background" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackground(MODE.DARK)}
            />
            <Label value="on background high" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackground(MODE.DARK, LEVEL.HIGH)}
            />
            <Label value="on background medium" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackground(MODE.DARK, LEVEL.MEDIUM)}
            />
            <Label value="on background disabled" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackground(MODE.DARK, LEVEL.DISABLED)}
            />
            <Label value="on background variant" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackgroundVariant(MODE.DARK, palette)}
            />
            <Label value="on background variant high" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackgroundVariant(MODE.DARK, palette, LEVEL.HIGH)}
            />
            <Label value="on background variant medium" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackgroundVariant(MODE.DARK, palette, LEVEL.MEDIUM)}
            />
            <Label value="on background variant disabled" />
            <Chip
              surface={getBackground(MODE.DARK)}
              on={getOnBackgroundVariant(MODE.DARK, palette, LEVEL.DISABLED)}
            />

            <Label value="surface" />
            <Chip surface={getSurface(MODE.DARK, palette)} />
            <Label value="on surface" />
            <Chip
              surface={getSurface(MODE.DARK, palette)}
              on={getOnSurface(MODE.DARK, palette)}
            />
            <Label value="on surface high" />
            <Chip
              surface={getSurface(MODE.DARK, palette)}
              on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
            />
            <Label value="on surface medium" />
            <Chip
              surface={getSurface(MODE.DARK, palette)}
              on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
            />
            <Label value="on surface disabled" />
            <Chip
              surface={getSurface(MODE.DARK, palette)}
              on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
            />

            <Label value="elevation" />
            <div className="flex mb-1">
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['00'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['01'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['02'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['03'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['04'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['06'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['08'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['12'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['16'])}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['24'])}
              />
            </div>
            <div className="flex mb-1">
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['00'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['01'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['02'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['03'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['04'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['06'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['08'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['12'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['16'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['24'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.HIGH)}
              />
            </div>
            <div className="flex mb-1">
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['00'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['01'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['02'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['03'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['04'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['06'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['08'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['12'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['16'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['24'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.MEDIUM)}
              />
            </div>
            <div className="flex">
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['00'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['01'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['02'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['03'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['04'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['06'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['08'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['12'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['16'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
              <Chip
                surface={getSurfaceElevated(MODE.DARK, palette, DEPTH['24'])}
                on={getOnSurface(MODE.DARK, palette, LEVEL.DISABLED)}
              />
            </div>

            <Label value="primary" />
            <Chip surface={getPrimary(MODE.DARK, palette)} />
            <Label value="on primary" />
            <Chip
              surface={getPrimary(MODE.DARK, palette)}
              on={getOnPrimary(MODE.DARK, palette)}
            />
            <Label value="on primary high" />
            <Chip
              surface={getPrimary(MODE.DARK, palette)}
              on={getOnPrimary(MODE.DARK, palette, LEVEL.HIGH)}
            />
            <Label value="on primary medium" />
            <Chip
              surface={getPrimary(MODE.DARK, palette)}
              on={getOnPrimary(MODE.DARK, palette, LEVEL.MEDIUM)}
            />
            <Label value="on primary disabled" />
            <Chip
              surface={getPrimary(MODE.DARK, palette)}
              on={getOnPrimary(MODE.DARK, palette, LEVEL.DISABLED)}
            />

            <Label value="primary variant" />
            <Chip surface={getPrimaryVariant(MODE.DARK, palette)} />
            <Label value="on primary variant" />
            <Chip
              surface={getPrimaryVariant(MODE.DARK, palette)}
              on={getOnPrimaryVariant(MODE.DARK, palette)}
            />
            <Label value="on primary high" />
            <Chip
              surface={getPrimaryVariant(MODE.DARK, palette)}
              on={getOnPrimaryVariant(MODE.DARK, palette, LEVEL.HIGH)}
            />
            <Label value="on primary medium" />
            <Chip
              surface={getPrimaryVariant(MODE.DARK, palette)}
              on={getOnPrimaryVariant(MODE.DARK, palette, LEVEL.MEDIUM)}
            />
            <Label value="on primary disabled" />
            <Chip
              surface={getPrimaryVariant(MODE.DARK, palette)}
              on={getOnPrimaryVariant(MODE.DARK, palette, LEVEL.DISABLED)}
            />

            <Label value="secondary" />
            <Chip surface={getSecondary(MODE.DARK, palette)} />
            <Label value="on secondary" />
            <Chip
              surface={getSecondary(MODE.DARK, palette)}
              on={getOnSecondary(MODE.DARK, palette)}
            />
            <Label value="on secondary high" />
            <Chip
              surface={getSecondary(MODE.DARK, palette)}
              on={getOnSecondary(MODE.DARK, palette, LEVEL.HIGH)}
            />
            <Label value="on secondary medium" />
            <Chip
              surface={getSecondary(MODE.DARK, palette)}
              on={getOnSecondary(MODE.DARK, palette, LEVEL.MEDIUM)}
            />
            <Label value="on secondary disabled" />
            <Chip
              surface={getSecondary(MODE.DARK, palette)}
              on={getOnSecondary(MODE.DARK, palette, LEVEL.DISABLED)}
            />

            <Label value="secondary variant" />
            <Chip surface={getSecondaryVariant(MODE.DARK, palette)} />
            <Label value="on secondary variant" />
            <Chip
              surface={getSecondaryVariant(MODE.DARK, palette)}
              on={getOnSecondaryVariant(MODE.DARK, palette)}
            />
            <Label value="on secondary high" />
            <Chip
              surface={getSecondaryVariant(MODE.DARK, palette)}
              on={getOnSecondaryVariant(MODE.DARK, palette, LEVEL.HIGH)}
            />
            <Label value="on secondary medium" />
            <Chip
              surface={getSecondaryVariant(MODE.DARK, palette)}
              on={getOnSecondaryVariant(MODE.DARK, palette, LEVEL.MEDIUM)}
            />
            <Label value="on secondary disabled" />
            <Chip
              surface={getSecondaryVariant(MODE.DARK, palette)}
              on={getOnSecondaryVariant(MODE.DARK, palette, LEVEL.DISABLED)}
            />

            <Label value="error" />
            <Chip surface={getError(MODE.DARK)} />
            <Label value="on error" />
            <Chip surface={getError(MODE.DARK)} on={getOnError(MODE.DARK)} />
            <Label value="on error high" />
            <Chip
              surface={getError(MODE.DARK)}
              on={getOnError(MODE.DARK, LEVEL.HIGH)}
            />
            <Label value="on error medium" />
            <Chip
              surface={getError(MODE.DARK)}
              on={getOnError(MODE.DARK, LEVEL.MEDIUM)}
            />
            <Label value="on error disabled" />
            <Chip
              surface={getError(MODE.DARK)}
              on={getOnError(MODE.DARK, LEVEL.DISABLED)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemePage;
