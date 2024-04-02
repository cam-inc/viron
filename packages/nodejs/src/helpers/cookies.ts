import { serialize, CookieSerializeOptions } from 'cookie';
import {
  COOKIE_KEY,
  DEFAULT_JWT_EXPIRATION_SEC,
  OAUTH2_STATE_EXPIRATION_SEC,
} from '../constants';

// Cookie文字列を生成
export const genCookie = (
  key: string,
  value: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (opts.httpOnly === undefined) {
    opts.httpOnly = true;
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
  // TODO: Set to true by default after all 3pcd support is complete
  // if (opts.partitioned === undefined) {
  //   opts.partitioned = true;
  // }
  return serialize(key, value, opts);
};

// 認証トークン用のCookie文字列を生成
export const genAuthorizationCookie = (
  token: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (!opts.maxAge && !opts.expires) {
    opts.maxAge = DEFAULT_JWT_EXPIRATION_SEC;
  }
  return genCookie(COOKIE_KEY.VIRON_AUTHORIZATION, token, opts);
};

// OAuthステート用のCookie文字列を生成
export const genOAuthStateCookie = (
  state: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (!opts.maxAge && !opts.expires) {
    opts.maxAge = OAUTH2_STATE_EXPIRATION_SEC;
  }
  return genCookie(COOKIE_KEY.OAUTH2_STATE, state, opts);
};
