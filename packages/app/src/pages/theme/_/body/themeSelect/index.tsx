import React, { useCallback } from 'react';
import Select from '~/components/select';
import { COLOR_SYSTEM } from '~/types';
import { X_Theme, X_THEME } from '~/types/oas';

export type Props = {
  theme: X_Theme;
  onRequestChange: (theme: X_Theme) => void;
};
const ThemeSelect: React.FC<Props> = ({ theme, onRequestChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const theme = e.currentTarget.value as X_Theme;
      onRequestChange(theme);
    },
    [onRequestChange]
  );

  return (
    <div>
      <Select<X_Theme>
        on={COLOR_SYSTEM.BACKGROUND}
        list={Object.values(X_THEME)}
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
