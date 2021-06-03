import { serialize, CookieSerializeOptions } from 'cookie';
import { COOKIE_KEY, DEFAULT_JWT_EXPIRATION_SEC } from '../constants';

// 認証トークン用のCookie文字列を生成
export const genAuthorizationCookie = (
  token: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (opts.httpOnly === undefined) {
    opts.httpOnly = true;
  }
  if (!opts.maxAge && !opts.expires) {
    opts.maxAge = DEFAULT_JWT_EXPIRATION_SEC;
  }
  if (!opts.path) {
    opts.path = '/';
  }
  if (opts.secure === undefined) {
    opts.secure = true;
  }
  if (!opts.sameSite) {
    opts.sameSite = 'none';
  }
  return serialize(COOKIE_KEY.VIRON_AUTHORIZATION, token, opts);
};
