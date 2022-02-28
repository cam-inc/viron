import React, { useCallback, useMemo, useState } from 'react';
import { Props as LayoutProps } from '~/layouts';
import { Theme, THEME } from '~/types/oas';
import { getTokens, Tokens } from '~/utils/colorSystem';
import Mode from './mode';
import Preview from './preview';
import ThemeSelect, { Props as ThemeSelectProps } from './themeSelect';
import Tones from './tones';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className = '' }) => {
  // Theme
  const [theme, setTheme] = useState<Theme>(THEME.RED);
  const handleThemeRequestChange = useCallback<
    ThemeSelectProps['onRequestChange']
  >((theme) => {
    setTheme(theme);
  }, []);

  // tokens
  const tokens = useMemo<Tokens>(() => getTokens(theme), [theme]);

  return (
    <div className={className}>
      <div className="p-4">
        {/* theme selection */}
        <div className="mb-2">
          <ThemeSelect
            theme={theme}
            onRequestChange={handleThemeRequestChange}
          />
        </div>
        <div>
          <Preview tokens={tokens} />
        </div>
        <div>
          <div>Modes</div>
          <ul className="flex flex-col gap-2">
            <li>
              <Mode title="Light Mode" mode={tokens.modes.light} />
            </li>
            <li>
              <Mode title="Dark Mode" mode={tokens.modes.dark} />
            </li>
          </ul>
        </div>
        <div>
          <div>Tonal Palettes</div>
          <ul className="flex flex-col gap-2">
            <li>
              <Tones
                title="Primary"
                list={tokens.tonalPalettes.keyColors.accent.primary}
              />
            </li>
            <li>
              <Tones
                title="Secondary"
                list={tokens.tonalPalettes.keyColors.accent.secondary}
              />
            </li>
            <li>
              <Tones
                title="Tertiary"
                list={tokens.tonalPalettes.keyColors.accent.tertiary}
              />
            </li>
            <li>
              <Tones
                title="Error"
                list={tokens.tonalPalettes.additionalColors.error.base}
              />
            </li>
            <li>
              <Tones
                title="Neutral"
                list={tokens.tonalPalettes.keyColors.neutral.base}
              />
            </li>
            <li>
              <Tones
                title="Neutral Variant"
                list={tokens.tonalPalettes.keyColors.neutral.variant}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Body;
