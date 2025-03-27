import { get, dynamicProvider, getBodyValue } from '../../src/config';
import { ExegesisIncomingMessage } from '../../src/application';
import {
  OAUTH2_GOOGLE_CALLBACK_PATH,
  OIDC_CALLBACK_PATH,
  unauthorized,
} from '@viron/lib';
import http from 'http';
import * as domainsAuth from '@viron/lib/src/domains/auth';
import sinon from 'sinon';

describe('Config Module', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  describe('get', () => {
    it('should return development config', () => {
      const config = get('mongo', 'development');
      expect(config).toBeDefined();
    });

    it('should return production config', () => {
      const config = get('mongo', 'production');
      expect(config).toBeDefined();
    });

    it('should return local config', () => {
      const config = get('mongo', 'local');
      expect(config).toBeDefined();
    });
  });

  describe('dynamicProvider', () => {
    const mockRequest = (
      url: string,
      body: Record<string, string>,
      cookies: Record<string, string> = {}
    ): ExegesisIncomingMessage => {
      const req = {
        url,
        headers: {
          cookie: Object.entries(cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join('; '),
        },
        body,
      } as unknown as ExegesisIncomingMessage;
      return req;
    };

    it('should handle OIDC callback path', async () => {
      process.env.OIDC_CLIENT_ID = 'test_oidc_client_id';
      process.env.OIDC_ISSUER_URL = 'https://oidc.example.com';

      const req = mockRequest('/oidc/callback', {
        clientId: 'test_oidc_client_id',
      });
      const result = await dynamicProvider(req);

      expect(result).toEqual({
        issuer: 'https://oidc.example.com',
        audience: ['test_oidc_client_id'],
      });
    });

    it('should handle Google OAuth2 callback path', async () => {
      process.env.GOOGLE_OAUTH2_CLIENT_ID = 'test_google_client_id';
      process.env.GOOGLE_OAUTH2_ISSUER_URL = 'https://google.example.com';

      const req = mockRequest('/oauth2/google/callback', {
        clientId: 'test_google_client_id',
      });
      const result = await dynamicProvider(req);

      expect(result).toEqual({
        issuer: 'https://google.example.com',
        audience: ['test_google_client_id'],
      });
    });

    it('should handle Email Signin path', async () => {
      process.env.EMAIL_JWT_ISSUER = 'https://email.example.com';
      process.env.EMAIL_JWT_AUDIENCE = 'email_audience';

      const req = mockRequest('/email/signin', {});
      const result = await dynamicProvider(req);

      expect(result).toEqual({
        issuer: 'https://email.example.com',
        audience: ['email_audience'],
      });
    });

    it('should handle token-based dynamic provider', async () => {
      process.env.EMAIL_JWT_ISSUER = 'https://email.example.com';
      process.env.EMAIL_JWT_AUDIENCE = 'email_audience';
      process.env.OIDC_CLIENT_ID = 'test_oidc_client_id';
      process.env.OIDC_ISSUER_URL = 'https://oidc.example.com';
      process.env.GOOGLE_OAUTH2_CLIENT_ID = 'test_google_client_id';
      process.env.GOOGLE_OAUTH2_ISSUER_URL = 'https://google.example.com';

      domainsAuth.initJwt(
        { provider: dynamicProvider, secret: 'test_secret' },
        true
      );

      const reqSign = mockRequest(
        OIDC_CALLBACK_PATH,
        { clientId: 'test_oidc_client_id' },
        { viron_authorization: 'test_token' }
      );

      const token = await domainsAuth.signJwt('123', reqSign);

      const req = mockRequest('/some/path', {}, { viron_authorization: token });

      const result = await dynamicProvider(req);

      expect(result).toEqual({
        issuer: 'https://oidc.example.com',
        audience: ['test_oidc_client_id'],
      });
    });

    it('should handle token-based dynamic provider no clientId', async () => {
      process.env.EMAIL_JWT_ISSUER = 'https://email.example.com';
      process.env.EMAIL_JWT_AUDIENCE = 'email_audience';
      process.env.OIDC_CLIENT_ID = 'test_oidc_client_id';
      process.env.OIDC_ISSUER_URL = 'https://oidc.example.com';
      process.env.GOOGLE_OAUTH2_CLIENT_ID = 'test_google_client_id';
      process.env.GOOGLE_OAUTH2_ISSUER_URL = 'https://google.example.com';

      domainsAuth.initJwt(
        { provider: dynamicProvider, secret: 'test_secret' },
        true
      );

      const reqSignOidc = mockRequest(
        OIDC_CALLBACK_PATH,
        {},
        { viron_authorization: 'test_token' }
      );

      await expect(domainsAuth.signJwt('123', reqSignOidc)).rejects.toThrow(
        unauthorized()
      );

      const reqSignGoogleOAuth = mockRequest(
        OAUTH2_GOOGLE_CALLBACK_PATH,
        {},
        { viron_authorization: 'test_token' }
      );

      await expect(
        domainsAuth.signJwt('123', reqSignGoogleOAuth)
      ).rejects.toThrow(unauthorized());
    });

    it('should throw unauthorized error for invalid token', async () => {
      const req = mockRequest('/some/path', {}, {});

      await expect(dynamicProvider(req)).rejects.toThrow(unauthorized());
    });
  });

  describe('getBodyValue', () => {
    it('should return the value of the specified key from the request body', async () => {
      const req = { body: { key: 'value' } } as unknown as http.IncomingMessage;
      const result = await getBodyValue(req, 'key');
      expect(result).toBe('value');
    });
  });
});
