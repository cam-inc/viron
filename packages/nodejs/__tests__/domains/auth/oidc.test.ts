import assert from 'assert';
import sinon from 'sinon';
import { generators, Issuer, Client, IdTokenClaims } from 'openid-client';
import * as domainAuthOidc from '../../../src/domains/auth/oidc';
import { initJwt } from '../../../src/domains/auth';
import {
  unsupportedScope,
  invalidOidcIdToken,
  forbidden,
  VironError,
  faildDecodeOidcIdToken,
  mismatchKidOidcIdToken,
  signinFailed,
} from '../../../src/errors';
import {
  findOneByEmail,
  createOne,
  AdminUser,
  AdminUserCreateAttributes,
  AdminUserUpdateAttributes,
  AdminUserCreatePayload,
} from '../../../src/domains/adminuser';
import { Repository, repositoryContainer } from '../../../src/repositories';
import { addRoleForUser, listRoles } from '../../../src/domains/adminrole';
import { ADMIN_ROLE, AUTH_PROVIDER, AUTH_TYPE } from '../../../src/constants';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import http from 'http';
import {
  AdminUserSsoToken,
  createOne as createOneSsoToken,
  findOneByClientIdAndUserId,
} from '../../../src/domains/adminuserssotoken';

describe('domains/auth/oidc', () => {
  // 共有の設定
  const redirectUri = 'https://example.com/oidcredirect';
  const defaultConfig = {
    clientId: 'oidc-client-id',
    clientSecret: 'oidc-client-secret',
    issuerUrl: 'https://example.com',
    additionalScopes: [],
  };

  let repository: Repository<
    AdminUser,
    AdminUserCreateAttributes,
    AdminUserUpdateAttributes
  >;

  beforeAll(() => {
    repository = repositoryContainer.getAdminUserRepository();
  });

  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  describe('genOidcClient', () => {
    it('OIDCクライアントの生成に成功する', async () => {
      // デフォルト設定でのテスト
      const config = defaultConfig;

      // モック作成
      const mockClient = {} as unknown as Client;
      const clientStub = sandbox.stub().returns(mockClient);
      const mockIssuer = {
        metadata: { scopes_supported: ['openid', 'email'] },
        Client: clientStub,
      } as unknown as Issuer<Client>;
      const discoverStub = sandbox
        .stub(Issuer, 'discover')
        .resolves(mockIssuer);

      // テスト対象の関数を呼び出し
      await domainAuthOidc.genOidcClient(config, redirectUri);

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(
        discoverStub,
        config.issuerUrl + '/.well-known/openid-configuration'
      );
      sinon.assert.calledOnceWithExactly(clientStub, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [redirectUri],
        response_types: ['code'],
      });
    });
    it('キャッシュされたOIDCクライアントが返却される', async () => {
      // デフォルト設定でのテスト
      const config = defaultConfig;

      // モック作成
      const mockClient = {} as unknown as Client;
      const clientStub = sandbox.stub().returns(mockClient);
      const mockIssuer = {
        metadata: { scopes_supported: ['openid', 'email'] },
        Client: clientStub,
      } as unknown as Issuer<Client>;
      const discoverStub = sandbox
        .stub(Issuer, 'discover')
        .resolves(mockIssuer);

      // テスト対象の関数を呼び出し
      // 一時呼び出してキャッシュされたOIDCクライアントを取得
      const firstCallOidcClient = await domainAuthOidc.genOidcClient(
        config,
        redirectUri,
        true
      );
      // 二度目の呼び出しでキャッシュされたOIDCクライアントを取得
      const secondCallOidcClient = await domainAuthOidc.genOidcClient(
        config,
        redirectUri
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(
        discoverStub,
        config.issuerUrl + '/.well-known/openid-configuration'
      );
      sinon.assert.calledOnceWithExactly(clientStub, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [redirectUri],
        response_types: ['code'],
      });

      assert.strictEqual(firstCallOidcClient, secondCallOidcClient);
    });
    it('サポートされてないscopeがある場合はエラー', async () => {
      // 追加スコープにoffline_accessを追加
      const config = {
        ...defaultConfig,
        additionalScopes: ['offline_access'],
      };

      // モックの作成
      const mockIssuer = {
        metadata: { scopes_supported: ['openid', 'email'] },
      } as unknown as Issuer<Client>;
      const discoverStub = sandbox
        .stub(Issuer, 'discover')
        .resolves(mockIssuer);

      // テスト対象の関数を呼び出し
      await assert.rejects(
        domainAuthOidc.genOidcClient(config, redirectUri, true),
        unsupportedScope()
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(
        discoverStub,
        config.issuerUrl + '/.well-known/openid-configuration'
      );
    });
  });

  describe('genOidcCodeVerifier', () => {
    it('OIDCのcodeVerifierの生成', async () => {
      const codeVerifierStub = sandbox
        .stub(generators, 'codeVerifier')
        .resolves('code-verifier');
      const result = await domainAuthOidc.genOidcCodeVerifier();
      assert.strictEqual(result, 'code-verifier');
      sinon.assert.calledOnce(codeVerifierStub);
    });
  });

  describe('getOidcAuthorizationUrl', () => {
    const state = 'XXXXXXX';
    const scope = 'openid email';
    const responseType = 'code';
    const codeVerifier = 'YYYYYYY';
    const config = defaultConfig;
    const codeChallengeMethod = 'S256';
    const codeChallenge = generators.codeChallenge(codeVerifier);
    const authorizationEndpoint = 'https://idp.jp/oidc/authz';
    const url = new URL(authorizationEndpoint);
    url.searchParams.append('client_id', config.clientId);
    url.searchParams.append('scope', scope);
    url.searchParams.append('response_type', responseType);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('code_challenge_method', codeChallengeMethod);
    url.searchParams.append('state', state);
    const authorizationUrl = url.toString();
    it('OIDCのIdpへの認証画面URL生成に成功する additionalScopesあり', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        additionalScopes: ['offline_access'],
      };

      // モックのClientを作成
      const authorizationUrlStub = sandbox.stub().returns(authorizationUrl);
      const mockClient = {
        authorizationUrl: authorizationUrlStub,
      } as unknown as Client;

      // モックのIssuerを作成
      const clientStub = sandbox.stub().returns(mockClient);
      const mockIssuer = {
        Client: clientStub,
        metadata: {},
        keystore: sandbox.stub(),
      } as unknown as Issuer<Client>;

      // Issuer.discover をモック
      const discoverStub = sandbox
        .stub(Issuer, 'discover')
        .resolves(mockIssuer);

      // テスト対象の関数を呼び出し
      const client = await domainAuthOidc.genOidcClient(
        config,
        redirectUri,
        true
      );
      const result = await domainAuthOidc.getOidcAuthorizationUrl(
        config,
        client,
        codeVerifier,
        state
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(
        discoverStub,
        config.issuerUrl + '/.well-known/openid-configuration'
      );
      sinon.assert.calledOnceWithExactly(clientStub, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [redirectUri],
        response_types: [responseType],
      });
      sinon.assert.calledOnceWithExactly(authorizationUrlStub, {
        scope: `${scope} offline_access`,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
      });

      // 結果の検証
      assert.strictEqual(result, authorizationUrl);
      const resultUrl = new URL(result);
      assert.strictEqual(resultUrl.searchParams.get('state'), state);
      assert.strictEqual(
        resultUrl.searchParams.get('client_id'),
        config.clientId
      );
    });
    it('OIDCのIdpへの認証画面URL生成に成功する additionalScopesなし', async () => {
      // テストデータ
      const config = defaultConfig;

      // モックのClientを作成
      const authorizationUrlStub = sandbox.stub().returns(authorizationUrl);
      const mockClient = {
        authorizationUrl: authorizationUrlStub,
      } as unknown as Client;

      // モックのIssuerを作成
      const clientStub = sandbox.stub().returns(mockClient);
      const mockIssuer = {
        Client: clientStub,
        metadata: {},
        keystore: sandbox.stub(),
      } as unknown as Issuer<Client>;

      // Issuer.discover をモック
      const discoverStub = sandbox
        .stub(Issuer, 'discover')
        .resolves(mockIssuer);

      // テスト対象の関数を呼び出し
      const client = await domainAuthOidc.genOidcClient(
        config,
        redirectUri,
        true
      );
      const result = await domainAuthOidc.getOidcAuthorizationUrl(
        config,
        client,
        codeVerifier,
        state
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(
        discoverStub,
        config.issuerUrl + '/.well-known/openid-configuration'
      );
      sinon.assert.calledOnceWithExactly(clientStub, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [redirectUri],
        response_types: [responseType],
      });
      sinon.assert.calledOnceWithExactly(authorizationUrlStub, {
        scope,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
      });

      // 結果の検証
      assert.strictEqual(result, authorizationUrl);
      const resultUrl = new URL(result);
      assert.strictEqual(resultUrl.searchParams.get('state'), state);
      assert.strictEqual(
        resultUrl.searchParams.get('client_id'),
        config.clientId
      );
    });
    it('OIDCのIdpへの認証画面URL生成に成功する', async () => {
      // テストデータ
      const state = 'XXXXXXX';
      const scope = 'openid email';
      const responseType = 'code';
      const codeVerifier = 'YYYYYYY';
      const config = defaultConfig;
      const codeChallengeMethod = 'S256';
      const codeChallenge = generators.codeChallenge(codeVerifier);
      const authorizationEndpoint = 'https://idp.jp/oidc/authz';
      const url = new URL(authorizationEndpoint);
      url.searchParams.append('client_id', config.clientId);
      url.searchParams.append('scope', scope);
      url.searchParams.append('response_type', responseType);
      url.searchParams.append('redirect_uri', redirectUri);
      url.searchParams.append('code_challenge', codeChallenge);
      url.searchParams.append('code_challenge_method', codeChallengeMethod);
      url.searchParams.append('state', state);
      const authorizationUrl = url.toString();

      // モックのClientを作成
      const authorizationUrlStub = sandbox.stub().returns(authorizationUrl);
      const mockClient = {
        authorizationUrl: authorizationUrlStub,
      } as unknown as Client;

      // モックのIssuerを作成
      const clientStub = sandbox.stub().returns(mockClient);
      const mockIssuer = {
        Client: clientStub,
        metadata: {},
        keystore: sandbox.stub(),
      } as unknown as Issuer<Client>;

      // Issuer.discover をモック
      const discoverStub = sandbox
        .stub(Issuer, 'discover')
        .resolves(mockIssuer);

      // テスト対象の関数を呼び出し
      const client = await domainAuthOidc.genOidcClient(
        config,
        redirectUri,
        true
      );
      const result = await domainAuthOidc.getOidcAuthorizationUrl(
        config,
        client,
        codeVerifier,
        state
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(
        discoverStub,
        config.issuerUrl + '/.well-known/openid-configuration'
      );
      sinon.assert.calledOnceWithExactly(clientStub, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [redirectUri],
        response_types: [responseType],
      });
      sinon.assert.calledOnceWithExactly(authorizationUrlStub, {
        scope,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
      });

      // 結果の検証
      assert.strictEqual(result, authorizationUrl);
      const resultUrl = new URL(result);
      assert.strictEqual(resultUrl.searchParams.get('state'), state);
      assert.strictEqual(
        resultUrl.searchParams.get('client_id'),
        config.clientId
      );
    });
  });

  describe('signinOidc', () => {
    // 共通の設定
    const codeVerifier = 'valid-code-verifier';
    const params = { state: 'state', code: 'auth-code' };

    beforeAll(() => {
      initJwt({
        secret: 'test',
        provider: AUTH_PROVIDER.CUSTOM,
      });
    });

    it('スーパーユーザーの初回ログインに成功する', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'Bearer yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'super_user@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        token_type: 'Bearer',
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;
      sandbox.stub(repository, 'count').withArgs().resolves(0);

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.signinOidc(
        {} as http.IncomingMessage,
        mockClient,
        codeVerifier,
        redirectUri,
        params,
        config,
        true
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });

      // 結果の検証
      expect(result).toMatch(/^Bearer /);

      // ユーザーが正しく作成されたか確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);

      // ロールが正しく設定されているか確認
      if (!actual) {
        throw new Error('User not found');
      }
      const roleIds = await listRoles(actual.id);
      assert.strictEqual(roleIds[0], ADMIN_ROLE.SUPER);
    });

    it('サインイン時にidTokenが取得できないエラー', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        claims: (): IdTokenClaims => ({
          email: 'user@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        domainAuthOidc.signinOidc(
          {} as http.IncomingMessage,
          mockClient,
          codeVerifier,
          redirectUri,
          params,
          config,
          true
        ),
        invalidOidcIdToken()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });
    });

    it('サインイン時にemailが取得できないエラー', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        domainAuthOidc.signinOidc(
          {} as http.IncomingMessage,
          mockClient,
          codeVerifier,
          redirectUri,
          params,
          config,
          true
        ),
        invalidOidcIdToken()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });
    });

    it('サインイン時にemailのドメインが許可対象外エラー', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['no-example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'user@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        domainAuthOidc.signinOidc(
          {} as http.IncomingMessage,
          mockClient,
          codeVerifier,
          redirectUri,
          params,
          config,
          true
        ),
        forbidden()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });
    });

    it('サインイン時にidTokenの有効期限が切れているエラー', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'user@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => true,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        domainAuthOidc.signinOidc(
          {} as http.IncomingMessage,
          mockClient,
          codeVerifier,
          redirectUri,
          params,
          config,
          true
        ),
        forbidden()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });
    });

    it('ビューアーユーザーの初回ログイン成功', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'viewer@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        token_type: 'Bearer',
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      // クライアントのモック
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでにsuperユーザーが存在する状態にする
      await createOne(true, {
        email: 'super@example.com',
      } as AdminUserCreatePayload);

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.signinOidc(
        {} as http.IncomingMessage,
        mockClient,
        codeVerifier,
        redirectUri,
        params,
        config,
        true
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });

      // 結果の検証
      expect(result).toMatch(/^Bearer /);

      // ユーザーが正しく作成されたか確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);

      // ロールが正しく設定されているか確認
      if (!actual) {
        throw new Error('User not found');
      }
      const roleIds = await listRoles(actual.id);
      assert.strictEqual(roleIds[0], ADMIN_ROLE.VIEWER);
    });

    it('multipleAuthUser=falseの場合にパスワード認証ユーザーが既にいて失敗する', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      const clientId = '67890';

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'registered@example.com',
          sub: 'sub',
          aud: clientId,
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        token_type: 'Bearer',
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(true, {
        email: mockTokenSet.claims().email as string,
        password: 'password',
      } as AdminUserCreatePayload);

      // SSOトークンの作成
      const userId = registeredUser.id;
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: 'zzzzz',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;
      await createOneSsoToken(ssoToken);

      // テスト対象の関数を呼び出し
      assert.rejects(
        domainAuthOidc.signinOidc(
          {} as http.IncomingMessage,
          mockClient,
          codeVerifier,
          redirectUri,
          params,
          config,
          false
        ),
        signinFailed()
      );

      // ユーザーが変わってないこと
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });
    });

    it('multipleAuthUser=falseの場合にOIDC認証ユーザーが既にいて失敗する', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      const clientId = '67890';

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx',
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'registered1@example.com',
          sub: 'sub',
          aud: clientId,
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        token_type: 'Bearer',
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(true, {
        email: mockTokenSet.claims().email as string,
      } as AdminUserCreatePayload);

      // SSOトークンの作成
      const userId = registeredUser.id;
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId,
        clientId: 'dummuy',
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: 'zzzzz',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;
      await createOneSsoToken(ssoToken);

      // テスト対象の関数を呼び出し
      assert.rejects(
        domainAuthOidc.signinOidc(
          {} as http.IncomingMessage,
          mockClient,
          codeVerifier,
          redirectUri,
          params,
          config,
          false
        ),
        signinFailed()
      );

      // ユーザーが変わってないこと
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });
    });

    it('登録済みユーザーで再ログインが成功する', async () => {
      // テストデータ
      const config = {
        ...defaultConfig,
        userHostedDomains: ['example.com'],
      };

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx_updated',
        id_token: 'yyyyy_updated',
        claims: (): IdTokenClaims => ({
          email: 'updated@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        token_type: 'Bearer',
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(true, {
        email: mockTokenSet.claims().email as string,
      } as AdminUserCreatePayload);
      await addRoleForUser(registeredUser.id, ADMIN_ROLE.VIEWER);

      // signinOidc関数を実行して結果を取得
      await domainAuthOidc.signinOidc(
        {} as http.IncomingMessage,
        mockClient,
        codeVerifier,
        redirectUri,
        params,
        config,
        true
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });

      // ユーザーが正しく更新されたか確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);

      // ロールが正しく設定されているか確認
      if (!actual) {
        throw new Error('User not found');
      }
      const roleIds = await listRoles(actual?.id);
      assert.strictEqual(roleIds[0], ADMIN_ROLE.VIEWER);
    });
  });

  describe('verifyOidcAccessToken', () => {
    it('リフレッシュトークンがある場合にアクセストークンをリフレッシュする', async () => {
      // テストデータ
      const config = defaultConfig;

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx_updated',
        id_token: 'yyyyy_updated',
        refresh_token: 'zzzzz',
        claims: (): IdTokenClaims => ({
          email: 'verify-access-token@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        token_type: 'Bearer',
        expired: (): boolean => false,
      };
      const refreshStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        refresh: refreshStub,
      } as unknown as Client;
      sandbox
        .stub(domainAuthOidc, 'verifyOidcIdToken')
        .withArgs()
        .resolves({ payload: mockTokenSet.claims(), expired: false });

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(true, {
        email: mockTokenSet.claims().email as string,
      } as AdminUserCreatePayload);

      const clientId = '67890';
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId: registeredUser.id,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: 'zzzzz',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      // SSOトークンを作成
      const registeredSsoToken = await createOneSsoToken(ssoToken);
      if (!registeredSsoToken) {
        throw new Error('SSO token create failed');
      }

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.verifyOidcAccessToken(
        mockClient,
        config,
        clientId,
        registeredUser.id,
        ssoToken
      );

      // 結果の検証
      assert.strictEqual(result, true);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(
        refreshStub,
        registeredSsoToken.refreshToken
      );

      // ユーザーが正しく更新されたか確認
      const actualUser = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      if (!actualUser) {
        throw new Error('User not found');
      }
      assert.strictEqual(actualUser?.email, mockTokenSet.claims().email);

      // SSOトークンが正しく作成されたか確認
      const actualSsoToken = await findOneByClientIdAndUserId(
        clientId,
        actualUser?.id
      );
      if (!actualSsoToken) {
        throw new Error('SSO token not found');
      }
      assert.strictEqual(actualSsoToken.accessToken, mockTokenSet.access_token);
    });
    it('credentialsが不正な場合はエラー', async () => {
      // テストデータ
      const config = defaultConfig;

      // テストデータ
      const userId = '12345';
      const clientId = '67890';
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: null,
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      // モックの作成
      const mockClient = {} as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.verifyOidcAccessToken(
        mockClient,
        config,
        clientId,
        userId,
        ssoToken
      );

      // 結果の検証
      assert.strictEqual(result, false);
    });
    it('IDトークンの検証に失敗した場合はエラー', async () => {
      // テストデータ
      const config = defaultConfig;

      // テストデータ
      const userId = '12345';
      const clientId = '67890';
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: null,
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      // モックの作成
      const mockClient = {} as unknown as Client;
      sandbox
        .stub(domainAuthOidc, 'verifyOidcIdToken')
        .withArgs()
        .rejects(faildDecodeOidcIdToken());

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.verifyOidcAccessToken(
        mockClient,
        config,
        clientId,
        userId,
        ssoToken
      );

      // 結果の検証
      assert.strictEqual(result, false);
    });
    it('リフレッシュトークンがなくIDトークンの有効期限が切れている場合はエラー', async () => {
      // テストデータ
      const config = defaultConfig;

      // テストデータ
      const userId = '12345';
      const clientId = '67890';
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: null,
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      // モックの作成
      const mockClient = {} as unknown as Client;
      sandbox
        .stub(domainAuthOidc, 'verifyOidcIdToken')
        .withArgs()
        .resolves({ payload: { exp: 1737455830 }, expired: true });

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.verifyOidcAccessToken(
        mockClient,
        config,
        clientId,
        userId,
        ssoToken
      );

      // 結果の検証
      assert.strictEqual(result, false);
    });
    it('リフレッシュトークンがある場合にアクセストークンの有効期限内はリフレッシュしない', async () => {
      // テストデータ
      const config = defaultConfig;

      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx_updated',
        id_token: 'yyyyy_updated',
        refresh_token: 'zzzzz',
        claims: (): IdTokenClaims => ({
          email: 'verify-access-token-no-refresh@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: Date.now() / 1000 + 10 * 60,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const refreshStub = sandbox.stub().resolves(mockTokenSet);
      const mockClient = {
        refresh: refreshStub,
      } as unknown as Client;
      sandbox
        .stub(domainAuthOidc, 'verifyOidcIdToken')
        .withArgs()
        .resolves({ payload: mockTokenSet.claims(), expired: false });

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(true, {
        email: mockTokenSet.claims().email as string,
      } as AdminUserCreatePayload);

      // SSRトークンを作成
      const clientId = '67890';
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId: registeredUser.id,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: 'zzzzz',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;
      const registeredSsoToken = await createOneSsoToken(ssoToken);
      if (!registeredSsoToken) {
        throw new Error('SSO token create failed');
      }

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.verifyOidcAccessToken(
        mockClient,
        config,
        clientId,
        registeredUser.id,
        registeredSsoToken
      );

      // 結果の検証
      assert.strictEqual(result, true);

      // スタブ呼び出し確認
      sinon.assert.notCalled(refreshStub);

      // ユーザーが更新されていないことを確認
      const actualUser = await findOneByEmail(
        mockTokenSet.claims().email as string,
        true
      );
      assert.strictEqual(actualUser?.email, registeredUser.email);

      // SSOトークンが更新されていないことを確認
      const actualSsoToken = await findOneByClientIdAndUserId(
        clientId,
        actualUser?.id
      );
      assert.strictEqual(actualSsoToken?.accessToken, ssoToken.accessToken);
      assert.strictEqual(actualSsoToken?.refreshToken, ssoToken.refreshToken);
      assert.strictEqual(actualSsoToken?.expiryDate, ssoToken.expiryDate);
      assert.strictEqual(actualSsoToken?.idToken, ssoToken.idToken);
      assert.strictEqual(actualSsoToken?.tokenType, ssoToken.tokenType);
      assert.strictEqual(actualSsoToken?.provider, ssoToken.provider);
      assert.strictEqual(actualSsoToken?.userId, ssoToken.userId);
      assert.strictEqual(actualSsoToken?.clientId, ssoToken.clientId);
    });
    it('アクセストークンのリフレッシュに失敗した場合はエラー', async () => {
      // テストデータ
      const config = defaultConfig;

      // テストデータ
      const userId = '12345';
      const clientId = '67890';
      const ssoToken = {
        authType: AUTH_TYPE.OIDC,
        userId,
        clientId,
        provider: AUTH_PROVIDER.CUSTOM,
        accessToken: 'xxxxx',
        expiryDate: 1737455830,
        idToken: 'yyyyy',
        refreshToken: 'zzzzz',
        tokenType: 'Bearer',
      } as AdminUserSsoToken;

      // モックの作成
      const refreshStub = sandbox.stub().rejects(new Error('refresh failed'));
      const mockClient = {
        refresh: refreshStub,
      } as unknown as Client;
      sandbox
        .stub(domainAuthOidc, 'verifyOidcIdToken')
        .withArgs()
        .resolves({ payload: { exp: 1737455830 }, expired: true });

      // テスト対象の関数を呼び出し
      const result = await domainAuthOidc.verifyOidcAccessToken(
        mockClient,
        config,
        clientId,
        userId,
        ssoToken
      );

      // 結果の検証
      assert.strictEqual(result, false);
    });
  });

  describe('verifyOidcIdToken', () => {
    // モックデータ
    const mockIdToken = 'mock-id-token';
    const mockDecodedJwt = {
      header: { kid: 'mock-kid' },
      payload: { sub: '12345', name: 'Test User' },
    };
    const mockKey = {
      toPEM: sinon.stub().returns('mock-public-key'),
      alg: 'RS256',
    };
    let decodeStub: sinon.SinonStub;
    let verifyStub: sinon.SinonStub;

    beforeEach(() => {
      // jwtの関数をモック化
      decodeStub = sinon.stub(jwt, 'decode');
      verifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('正常にJWTを検証しペイロードと期限切れ判定を返す', async () => {
      // モックのセットアップ
      const mockClient = {
        issuer: {
          metadata: {
            issuer: 'https://example.com',
          },
          keystore: sinon.stub(),
        },
      };
      decodeStub.returns(mockDecodedJwt); // `jwt.decode` の戻り値を設定
      mockClient.issuer.keystore.resolves({
        get: sinon.stub().withArgs({ kid: 'mock-kid' }).returns(mockKey),
      }); // `keystore` モック
      verifyStub.returns({ sub: '12345', name: 'Test User' }); // `jwt.verify` の戻り値を設定

      // 実行
      const result = await domainAuthOidc.verifyOidcIdToken(
        mockClient as unknown as Client,
        defaultConfig,
        mockIdToken
      );

      // 結果の検証
      expect(result).toEqual({
        payload: { sub: '12345', name: 'Test User' },
        expired: false,
      });

      // スタブ呼び出し確認
      sinon.assert.calledOnce(decodeStub);
      sinon.assert.calledOnce(mockClient.issuer.keystore);
      sinon.assert.calledOnce(verifyStub);
      sinon.assert.calledWith(verifyStub, mockIdToken, 'mock-public-key', {
        audience: defaultConfig.clientId,
        issuer: mockClient.issuer.metadata.issuer,
        algorithms: ['RS256'],
      });
    });

    it('JWTのデコードに失敗した場合にエラーをスローする', async () => {
      // モックのセットアップ
      const mockClient = {
        issuer: {
          metadata: {
            issuer: 'https://example.com',
          },
          keystore: sinon.stub(),
        },
      };
      decodeStub.returns(null); // デコード失敗時

      // テスト対象の関数を呼び出し
      assert.rejects(
        domainAuthOidc.verifyOidcIdToken(
          mockClient as unknown as Client,
          defaultConfig,
          mockIdToken
        ),
        faildDecodeOidcIdToken()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnce(decodeStub);
      sinon.assert.notCalled(mockClient.issuer.keystore);
      sinon.assert.notCalled(verifyStub);
    });

    it('kidに対応する公開鍵が見つからない場合にエラーをスローする', async () => {
      // モックのセットアップ
      const mockClient = {
        issuer: {
          metadata: {
            issuer: 'https://example.com',
          },
          keystore: sinon.stub(),
        },
      };
      decodeStub.returns(mockDecodedJwt);
      mockClient.issuer.keystore.resolves({
        get: sinon.stub().withArgs({ kid: 'mock-kid' }).returns(null),
      }); // 公開鍵が見つからない場合

      assert.rejects(
        domainAuthOidc.verifyOidcIdToken(
          mockClient as unknown as Client,
          defaultConfig,
          mockIdToken
        ),
        mismatchKidOidcIdToken()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnce(decodeStub);
      sinon.assert.calledOnce(mockClient.issuer.keystore);
      sinon.assert.notCalled(verifyStub);
    });

    it('JWTの検証で期限切れの場合はペイロードと期限切れ判定を返す', async () => {
      // モックのセットアップ
      const mockClient = {
        issuer: {
          metadata: {
            issuer: 'https://example.com',
          },
          keystore: sinon.stub(),
        },
      };
      decodeStub.returns(mockDecodedJwt);
      mockClient.issuer.keystore.resolves({
        get: sinon.stub().withArgs({ kid: 'mock-kid' }).returns(mockKey),
      });
      verifyStub.throws(new TokenExpiredError('jwt expired', new Date())); // 検証失敗時

      const result = await domainAuthOidc.verifyOidcIdToken(
        mockClient as unknown as Client,
        defaultConfig,
        mockIdToken
      );

      // 結果の検証
      expect(result).toEqual({
        payload: { sub: '12345', name: 'Test User' },
        expired: true,
      });

      // スタブ呼び出し確認
      sinon.assert.calledOnce(decodeStub);
      sinon.assert.calledOnce(mockClient.issuer.keystore);
      sinon.assert.calledOnce(verifyStub);
    });

    it('JWTの検証で期限切れ以外の場合は例外をスロー', async () => {
      // モックのセットアップ
      const mockClient = {
        issuer: {
          metadata: {
            issuer: 'https://example.com',
          },
          keystore: sinon.stub(),
        },
      };
      decodeStub.returns(mockDecodedJwt);
      mockClient.issuer.keystore.resolves({
        get: sinon.stub().withArgs({ kid: 'mock-kid' }).returns(mockKey),
      });
      const illigalException = (): VironError => {
        return new VironError('iligal error.', 500);
      };
      verifyStub.throws(illigalException); // 検証失敗時

      await assert.rejects(
        domainAuthOidc.verifyOidcIdToken(
          mockClient as unknown as Client,
          defaultConfig,
          mockIdToken
        ),
        illigalException()
      );

      // スタブ呼び出し確認
      sinon.assert.calledOnce(decodeStub);
      sinon.assert.calledOnce(mockClient.issuer.keystore);
      sinon.assert.calledOnce(verifyStub);
    });
  });
});
