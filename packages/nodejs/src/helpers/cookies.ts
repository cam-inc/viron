import { serialize, CookieSerializeOptions } from 'cookie';
import {
  COOKIE_KEY,
  DEFAULT_JWT_EXPIRATION_SEC,
  OAUTH2_STATE_EXPIRATION_SEC,
  OIDC_STATE_EXPIRATION_SEC,
  OIDC_CODE_VERIFIER_EXPIRATION_SEC,
} from '../constants';

// Cookie文字列を生成
export const genCookie = (
  key: string,
  value: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  opts.httpOnly ??= true;
  opts.path ??= '/';
  opts.secure ??= true;
  opts.sameSite ??= 'none';
  opts.partitioned ??= false;
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

// OIDCステート用のCookie文字列を生成
export const genOidcStateCookie = (
  state: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (!opts.maxAge && !opts.expires) {
    opts.maxAge = OIDC_STATE_EXPIRATION_SEC;
  }
  return genCookie(COOKIE_KEY.OIDC_STATE, state, opts);
};

// OIDC PKCE用CodeVerifierのCookie文字列を生成
export const genOidcCodeVerifierCookie = (
  codeVerifier: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (!opts.maxAge && !opts.expires) {
    opts.maxAge = OIDC_CODE_VERIFIER_EXPIRATION_SEC;
  }
  return genCookie(COOKIE_KEY.OIDC_CODE_VERIFIER, codeVerifier, opts);
};
