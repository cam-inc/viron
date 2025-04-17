import { useEffect } from 'react';
import { useAppThemeGlobalStateSet } from '~/store';
import { Document } from '~/types/oas';

export default (document: Document | null = null): void => {
  const setTheme = useAppThemeGlobalStateSet();
  useEffect(() => {
    if (document?.info['x-theme']) {
      setTheme(document.info['x-theme']);
    } else {
      setTheme('default');
    }
  }, [document, setTheme]);
};
