import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '$store/atoms/app';
import { Document, X_THEME } from '$types/oas';

const useTheme = function (document: Document | null = null): void {
  const [, setTheme] = useRecoilState(themeState);
  useEffect(
    function () {
      if (document?.info['x-theme']) {
        setTheme(document.info['x-theme']);
      } else {
        //setTheme(X_THEME.RED);
        setTheme(X_THEME.BRUTAL_PINK);
      }
    },
    [document, setTheme]
  );
};
export default useTheme;
