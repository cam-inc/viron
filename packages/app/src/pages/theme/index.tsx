import { PageProps, graphql } from 'gatsby';
import React, { useCallback, useMemo } from 'react';
import { AppSidebar } from '~/components/app-sidebar';
import Metadata from '~/components/metadata';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import useTheme from '~/hooks/theme';
import {
  useAppThemeGlobalStateValue,
  useAppThemeGlobalStateSet,
} from '~/store';
import { Tokens, getTokens } from '~/utils/colorSystem';
import Mode from './_/body/mode';
import Preview from './_/body/preview';
import ThemeSelect, { Props as ThemeSelectProps } from './_/body/themeSelect';
import Tones from './_/body/tones';

type Props = PageProps;
const ThemePage: React.FC<Props> = () => {
  useTheme();

  const theme = useAppThemeGlobalStateValue();
  const setTheme = useAppThemeGlobalStateSet();
  const handleThemeRequestChange = useCallback<
    ThemeSelectProps['onRequestChange']
  >(
    (theme) => {
      setTheme(theme);
    },
    [setTheme]
  );

  // tokens
  const tokens = useMemo<Tokens>(() => getTokens(theme), [theme]);

  return (
    <>
      <Metadata />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div>
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
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default ThemePage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
