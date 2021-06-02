import { serialize, CookieSerializeOptions } from 'cookie';
import { COOKIE_KEY } from '../constants';

// 認証トークン用のCookie文字列を生成
export const genAuthorizationCookie = (
  token: string,
  options: CookieSerializeOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  }
): string => {
  return serialize(COOKIE_KEY.VIRON_AUTHORIZATION, token, options);
};
