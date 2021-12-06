import { useEffect } from 'react';
import { useAppThemeGlobalStateSet } from '$store/index';
import { Document, X_THEME } from '$types/oas';

export default (document: Document | null = null): void => {
  const setTheme = useAppThemeGlobalStateSet();
  useEffect(() => {
    if (document?.info['x-theme']) {
      setTheme(document.info['x-theme']);
    } else {
      setTheme(X_THEME.RED);
    }
  }, [document, setTheme]);
};
