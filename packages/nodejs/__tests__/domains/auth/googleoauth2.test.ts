import assert from 'assert';
import sinon, { SinonStub } from 'sinon';
import { google, Auth } from 'googleapis';
import {
  getGoogleOAuth2AuthorizationUrl,
  initJwt,
  signinGoogleOAuth2,
  verifyGoogleOAuth2AccessToken,
} from '../../../src/domains/auth';
import { forbidden, invalidGoogleOAuth2Token } from '../../../src/errors';
import { domainsAdminUser } from '../../../src/domains';
import http from 'http';
import {
  AdminUserSsoToken,
  createOne as createOneSsoToken,
} from '../../../src/domains/adminuserssotoken';
import { AUTH_PROVIDER, AUTH_TYPE } from '../../../src/constants';
import {
  createOne,
  AdminUserCreatePayload,
} from '../../../src/domains/adminuser';

describe('domains/auth/googleoauth2', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('getGoogleOAuth2AuthorizationUrl', () => {
    it('Get authorization url with minimum options.', () => {
      const redirectUrl = 'https://example.com/oauthredirect';
      const state = 'XXXXXXX';
      const config = {
        clientId: 'google-oauth2-client-id',
        clientSecret: 'google-oauth2-client-secret',
        issuerUrl: 'https://accounts.google.com',
      };
      const result = getGoogleOAuth2AuthorizationUrl(
        redirectUrl,
        state,
        config
      );
      assert(result);
      const url = new URL(result);
      assert.strictEqual(url.searchParams.get('state'), state);
      assert.strictEqual(
        url.searchParams.get('scope'),
        'https://www.googleapis.com/auth/userinfo.email'
      );
      assert.strictEqual(url.searchParams.get('client_id'), config.clientId);
    });

    it('Get authorization url with additionalScopes and userHostedDomains.', () => {
      const redirectUrl = 'https://example.com/oauthredirect';
      const state = 'XXXXXXX';
      const config = {
        clientId: 'google-oauth2-client-id',
        clientSecret: 'google-oauth2-client-secret',
        issuerUrl: 'https://accounts.google.com',
        additionalScopes: ['https://www.googleapis.com/auth/spreadsheets'],
        userHostedDomains: ['example.com'],
      };
      const result = getGoogleOAuth2AuthorizationUrl(
        redirectUrl,
        state,
        config
      );
      assert(result);
      const url = new URL(result);
      assert.strictEqual(url.searchParams.get('state'), state);
      assert.strictEqual(
        url.searchParams.get('scope'),
        'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets'
      );
      assert.strictEqual(
        url.searchParams.get('hd'),
        config.userHostedDomains[0]
      );
      assert.strictEqual(url.searchParams.get('client_id'), config.clientId);
    });
  });

  describe('signinGoogleOAuth2', () => {
    const redirectUrl = 'https://example.com/oauthredirect';
    const config = {
      clientId: 'google-oauth2-client-id',
      clientSecret: 'google-oauth2-client-secret',
      userHostedDomains: ['example.com'],
      issuerUrl: 'https://accounts.google.com',
    };
    let dummyClient: Auth.OAuth2Client;

    beforeAll(() => {
      initJwt({
        secret: 'test',
        provider: 'google',
      });
      dummyClient = new google.auth.OAuth2(
        config.clientId,
        config.clientSecret,
        redirectUrl
      );
    });

    beforeEach(() => {
      sandbox
        .stub(google.auth, 'OAuth2')
        .callsFake(sandbox.fake())
        .returns(dummyClient);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getStub = <T extends keyof Auth.OAuth2Client, U extends any[]>(
      funcName: T
    ): SinonStub<U> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return sandbox.stub<any, T>(dummyClient, funcName) as SinonStub<U>;
    };

    it('Succeed to signin with google', async () => {
      const code = 'aaaaaaaaaaaaaaaaaaaaa';

      getStub<'getToken', [string]>('getToken')
        .withArgs(code)
        .resolves({
          tokens: {
            access_token: 'ACCESSTOKEN',
            expiry_date: 1623828515177,
            id_token: 'IDTOKEN',
            refresh_token: 'REFRESHTOKEN',
            token_type: 'Bearer',
          },
        });
      getStub<'verifyIdToken', [Auth.VerifyIdTokenOptions]>('verifyIdToken')
        .withArgs(
          sinon.match({
            idToken: 'IDTOKEN',
            audience: config.clientId,
          })
        )
        .resolves(
          new Auth.LoginTicket(undefined, {
            iss: 'ISSUER',
            sub: 'identifier',
            aud: 'audience',
            iat: Date.now(),
            exp: Date.now() + 100000,
            email: 'test@example.com',
          })
        );

      const result = await signinGoogleOAuth2(
        {} as http.IncomingMessage,
        code,
        redirectUrl,
        config,
        true
      );
      assert(result.startsWith('Bearer '));
    });

    it('Failed to login when invalid creadentials', async () => {
      const code = 'aaaaaaaaaaaaaaaaaaaaa';

      getStub<'getToken', [string]>('getToken')
        .withArgs(code)
        .resolves({
          tokens: {
            access_token: 'ACCESSTOKEN',
            expiry_date: 1623828515177,
            id_token: '',
            refresh_token: 'REFRESHTOKEN',
            token_type: 'Bearer',
          },
        });

      const expects = invalidGoogleOAuth2Token();
      assert.rejects(
        signinGoogleOAuth2(
          {} as http.IncomingMessage,
          code,
          redirectUrl,
          config,
          true
        ),
        {
          message: expects.message,
          name: expects.name,
          statusCode: expects.statusCode,
        }
      );
    });

    it('Failed to login when invalid loginTicket', async () => {
      const code = 'aaaaaaaaaaaaaaaaaaaaa';

      getStub<'getToken', [string]>('getToken')
        .withArgs(code)
        .resolves({
          tokens: {
            access_token: 'ACCESSTOKEN',
            expiry_date: 1623828515177,
            id_token: 'IDTOKEN',
            refresh_token: 'REFRESHTOKEN',
            token_type: 'Bearer',
          },
        });
      getStub<'verifyIdToken', [Auth.VerifyIdTokenOptions]>('verifyIdToken')
        .withArgs(
          sinon.match({
            idToken: 'IDTOKEN',
            audience: config.clientId,
          })
        )
        .resolves(
          new Auth.LoginTicket(undefined, {
            iss: 'ISSUER',
            sub: 'identifier',
            aud: 'audience',
            iat: Date.now(),
            exp: Date.now() + 100000,
          })
        );

      const expects = invalidGoogleOAuth2Token();
      assert.rejects(
        signinGoogleOAuth2(
          {} as http.IncomingMessage,
          code,
          redirectUrl,
          config,
          true
        ),
        {
          message: expects.message,
          name: expects.name,
          statusCode: expects.statusCode,
        }
      );
    });

    it('Failed to login when email domain isn`t hosted.', async () => {
      const code = 'aaaaaaaaaaaaaaaaaaaaa';

      getStub<'getToken', [string]>('getToken')
        .withArgs(code)
        .resolves({
          tokens: {
            access_token: 'ACCESSTOKEN',
            expiry_date: 1623828515177,
            id_token: 'IDTOKEN',
            refresh_token: 'REFRESHTOKEN',
            token_type: 'Bearer',
          },
        });
      getStub<'verifyIdToken', [Auth.VerifyIdTokenOptions]>('verifyIdToken')
        .withArgs(
          sinon.match({
            idToken: 'IDTOKEN',
            audience: config.clientId,
          })
        )
        .resolves(
          new Auth.LoginTicket(undefined, {
            iss: 'ISSUER',
            sub: 'identifier',
            aud: 'audience',
            iat: Date.now(),
            exp: Date.now() + 100000,
            email: 'test@x.example.com',
          })
        );

      const expects = forbidden();
      assert.rejects(
        signinGoogleOAuth2(
          {} as http.IncomingMessage,
          code,
          redirectUrl,
          config,
          true
        ),
        {
          message: expects.message,
          name: expects.name,
          statusCode: expects.statusCode,
        }
      );
    });
  });

  describe('verifyGoogleOAuth2AccessToken', () => {
    const config = {
      clientId: 'google-oauth2-client-id',
      clientSecret: 'google-oauth2-client-secret',
      userHostedDomains: ['example.com'],
      issuerUrl: 'https://accounts.google.com',
    };

    it('Succeed to verify access token.', async () => {
      const userId = '1';
      const clientId = '12345';
      const ssoToken = {
        provider: AUTH_PROVIDER.GOOGLE,
        authType: AUTH_TYPE.OIDC,
        clientId,
        userId,
        accessToken: 'ACCESSTOKEN',
        expiryDate: 1623828515177,
        idToken: 'IDTOKEN',
        refreshToken: 'REFRESHTOKEN',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      const dummyClient = new google.auth.GoogleAuth().fromJSON({
        type: 'authorized_user',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: ssoToken.refreshToken ?? undefined,
      });

      sandbox
        .stub(google.auth, 'GoogleAuth')
        .callsFake(sandbox.fake())
        .returns({
          fromJSON: () => dummyClient,
        });

      sandbox.stub(dummyClient, 'getAccessToken').resolves({});

      const result = await verifyGoogleOAuth2AccessToken(
        clientId,
        userId,
        ssoToken,
        config
      );
      assert.strictEqual(result, true);
    });

    it('Succeed to verify access token with refresh.', async () => {
      const clientId = '12345';
      const ssoToken = {
        provider: AUTH_PROVIDER.GOOGLE,
        authType: AUTH_TYPE.OIDC,
        clientId,
        accessToken: 'ACCESSTOKEN',
        expiryDate: 1623828515177,
        idToken: 'IDTOKEN',
        refreshToken: 'REFRESHTOKEN',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      const dummyClient = new google.auth.GoogleAuth().fromJSON({
        type: 'authorized_user',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: ssoToken.refreshToken ?? undefined,
      });

      sandbox
        .stub(google.auth, 'GoogleAuth')
        .callsFake(sandbox.fake())
        .returns({
          fromJSON: () => dummyClient,
        });
      sandbox.stub(dummyClient, 'getAccessToken').resolves({
        res: {
          data: {
            access_token: 'NEW_ACCESSTOKEN',
            expiry_date: 1623828515177,
            id_token: 'NEW_IDTOKEN',
            refresh_token: 'NEW_REFRESHTOKEN',
            token_type: 'Bearer',
          },
        },
      });
      sandbox.stub(domainsAdminUser, 'updateOneById').resolves();

      // user creation
      const registeredUser = await createOne(true, {
        email: 'super1@example.com',
      } as AdminUserCreatePayload);
      ssoToken.userId = registeredUser.id;

      // SSO token creation
      await createOneSsoToken(ssoToken);

      const result = await verifyGoogleOAuth2AccessToken(
        clientId,
        ssoToken.userId,
        ssoToken,
        config
      );
      assert.strictEqual(result, true);
    });

    it('Failed to refresh.', async () => {
      const userId = '1';
      const clientId = '12345';
      const ssoToken = {
        provider: AUTH_PROVIDER.GOOGLE,
        authType: AUTH_TYPE.OIDC,
        clientId,
        userId,
        accessToken: 'ACCESSTOKEN',
        expiryDate: 1623828515177,
        idToken: 'IDTOKEN',
        refreshToken: 'REFRESHTOKEN',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      const dummyClient = new google.auth.GoogleAuth().fromJSON({
        type: 'authorized_user',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: ssoToken.refreshToken ?? undefined,
      });

      sandbox
        .stub(google.auth, 'GoogleAuth')
        .callsFake(sandbox.fake())
        .returns({
          fromJSON: () => dummyClient,
        });
      sandbox.stub(dummyClient, 'getAccessToken').resolves({
        res: {
          status: 500,
        },
      });

      const result = await verifyGoogleOAuth2AccessToken(
        clientId,
        userId,
        ssoToken,
        config
      );
      assert.strictEqual(result, false);
    });
  });
});
