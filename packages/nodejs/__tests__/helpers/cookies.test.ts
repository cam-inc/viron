import {
  genCookie,
  genAuthorizationCookie,
  genOAuthStateCookie,
  genOidcStateCookie,
  genOidcCodeVerifierCookie,
} from '../../src/helpers/cookies';
import {
  DEFAULT_JWT_EXPIRATION_SEC,
  OAUTH2_STATE_EXPIRATION_SEC,
  OIDC_STATE_EXPIRATION_SEC,
  OIDC_CODE_VERIFIER_EXPIRATION_SEC,
} from '../../src/constants';
import { CookieSerializeOptions } from 'cookie';

describe('Cookie Helpers', () => {
  describe('genCookie', () => {
    it('should generate a cookie string with default options', () => {
      const result = genCookie('test', 'value');
      expect(result).toContain('HttpOnly');
      expect(result).toContain('Secure');
      expect(result).toContain('SameSite=None');
    });

    it('should override default options', () => {
      const options: CookieSerializeOptions = {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      };
      const result = genCookie('test', 'value', options);
      expect(result).not.toContain('HttpOnly');
      expect(result).not.toContain('Secure');
      expect(result).toContain('SameSite=Lax');
    });
  });

  describe('genAuthorizationCookie', () => {
    it('should generate an authorization cookie with default maxAge', () => {
      const result = genAuthorizationCookie('token');
      expect(result).toContain(`Max-Age=${DEFAULT_JWT_EXPIRATION_SEC}`);
    });
  });

  describe('genOAuthStateCookie', () => {
    it('should generate an OAuth state cookie with default maxAge', () => {
      const result = genOAuthStateCookie('state');
      expect(result).toContain(`Max-Age=${OAUTH2_STATE_EXPIRATION_SEC}`);
    });
  });

  describe('genOidcStateCookie', () => {
    it('should generate an OIDC state cookie with default maxAge', () => {
      const result = genOidcStateCookie('state');
      expect(result).toContain(`Max-Age=${OIDC_STATE_EXPIRATION_SEC}`);
    });
  });

  describe('genOidcCodeVerifierCookie', () => {
    it('should generate an OIDC code verifier cookie with default maxAge', () => {
      const result = genOidcCodeVerifierCookie('codeVerifier');
      expect(result).toContain(`Max-Age=${OIDC_CODE_VERIFIER_EXPIRATION_SEC}`);
    });
  });
});
