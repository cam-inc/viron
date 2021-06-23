import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '$store/atoms/app';
import { Document } from '$types/oas';

const useTheme = function (document: Document | null = null): void {
  const [, setTheme] = useRecoilState(themeState);
  useEffect(
    function () {
      if (document?.info['x-theme']) {
        setTheme(document.info['x-theme']);
      } else {
        setTheme(null);
      }
    },
    [document, setTheme]
  );
};
export default useTheme;
