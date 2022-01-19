import React, { useCallback } from 'react';
import Select from '~/components/select';
import { COLOR_SYSTEM } from '~/types';
import { Theme, THEME } from '~/types/oas';

export type Props = {
  theme: Theme;
  onRequestChange: (theme: Theme) => void;
};
const ThemeSelect: React.FC<Props> = ({ theme, onRequestChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const theme = e.currentTarget.value as Theme;
      onRequestChange(theme);
    },
    [onRequestChange]
  );

  return (
    <div>
      <Select<Theme>
        on={COLOR_SYSTEM.BACKGROUND}
        list={Object.values(THEME)}
        Select={({ className, children }) => (
          <select className={className} value={theme} onChange={handleChange}>
            {children}
          </select>
        )}
        Option={({ className, data }) => (
          <option className={className} value={data}>
            {data}
          </option>
        )}
      />
    </div>
  );
};
export default ThemeSelect;
