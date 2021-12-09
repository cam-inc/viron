import React, { useCallback } from 'react';
import { X_Theme, X_THEME } from '$types/oas';

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
      <select value={theme} onChange={handleChange}>
        {Object.values(X_THEME).map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
};
export default ThemeSelect;
