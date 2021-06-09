import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from '$store/atoms/app';
import { Document } from '$types/oas';

const useTheme = function (document: Document | null = null): void {
  const [, setTheme] = useRecoilState(themeState);
  // TODO: Themeの種類とカラバリが決まったらif文を元に戻すこと。x-themeが指定されていない場合はtheme=nullで表示できる。
  useEffect(
    function () {
      if (!!document) {
        setTheme(document.info['x-theme'] || 'relax');
        //if (!!document && !!document.info['x-theme']) {
        //setTheme(document.info['x-theme']);
      } else {
        setTheme(null);
      }
    },
    [document, setTheme]
  );
};
export default useTheme;
