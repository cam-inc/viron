import { useRecoilState } from 'recoil';
import { themeState } from '$store/atoms/app';
import { Document } from '$types/oas';

const useTheme = function (document: Document | null = null): void {
  const [, setTheme] = useRecoilState(themeState);
  if (!!document) {
    //if (!!document && !!document.info['x-theme']) {
    setTheme(document.info['x-theme'] || 'relax');
  } else {
    setTheme(null);
  }
};
export default useTheme;
