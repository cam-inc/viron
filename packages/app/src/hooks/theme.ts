import { useEffect } from 'react';
import { useAppThemeGlobalStateSet } from '~/store';
import { Document, THEME } from '~/types/oas';

export default (document: Document | null = null): void => {
  const setTheme = useAppThemeGlobalStateSet();
  useEffect(() => {
    if (document?.info['x-theme']) {
      setTheme(document.info['x-theme']);
    } else {
      //setTheme(THEME.RED);
      setTheme(THEME.BLUE);
    }
  }, [document, setTheme]);
};
