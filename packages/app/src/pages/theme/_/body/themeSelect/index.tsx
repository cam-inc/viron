import React, { useCallback } from 'react';
import { Select, SelectItem } from '~/components/ui/select';
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
      <Select value={theme} onChange={handleChange}>
        {Object.values(THEME).map((item, idx) => (
          <SelectItem key={idx} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
export default ThemeSelect;
