import assert from 'assert';
import sinon from 'sinon';
import { generators, Issuer, Client, IdTokenClaims } from 'openid-client';
import {
  getOidcAuthorizationUrl,
  genOidcClient,
  signinOidc,
  verifyOidcAccessToken,
  initJwt,
  genOidcCodeVerifier,
} from '../../../src/domains/auth';
import {
  unsupportedScope,
  invalidOidcToken,
  forbidden,
  signinFailed,
} from '../../../src/errors';
import {
  findOneByEmail,
  createOne,
  AdminUser,
  AdminUserCreateAttributes,
  AdminUserUpdateAttributes,
} from '../../../src/domains/adminuser';
import { Repository, repositoryContainer } from '../../../src/repositories';
import { addRoleForUser, listRoles } from '../../../src/domains/adminrole';
import { AUTH_TYPE, ADMIN_ROLE } from '../../../src/constants';

describe('domains/auth/oidc', () => {
  // 共有の設定
  const redirectUri = 'https://example.com/oidcredirect';
  const defaultConfig = {
    clientId: 'oidc-client-id',
    clientSecret: 'oidc-client-secret',
    configurationUrl: 'https://example.com/.well-known/openid-configuration',
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
      await genOidcClient(config, redirectUri);

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(discoverStub, config.configurationUrl);
      sinon.assert.calledOnceWithExactly(clientStub, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [redirectUri],
        response_types: ['code'],
      });
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
        genOidcClient(config, redirectUri),
        unsupportedScope()
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(discoverStub, config.configurationUrl);
    });
  });

  describe('genOidcCodeVerifier', () => {
    it('OIDCのcodeVerifierの生成', async () => {
      const codeVerifierStub = sandbox
        .stub(generators, 'codeVerifier')
        .resolves('code-verifier');
      const result = await genOidcCodeVerifier();
      assert.strictEqual(result, 'code-verifier');
      sinon.assert.calledOnceWithExactly(codeVerifierStub);
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
      const client = await genOidcClient(config, redirectUri);
      const result = await getOidcAuthorizationUrl(
        config,
        client,
        codeVerifier,
        state
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(discoverStub, config.configurationUrl);
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
      const client = await genOidcClient(config, redirectUri);
      const result = await getOidcAuthorizationUrl(
        config,
        client,
        codeVerifier,
        state
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(discoverStub, config.configurationUrl);
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
      const client = await genOidcClient(config, redirectUri);
      const result = await getOidcAuthorizationUrl(
        config,
        client,
        codeVerifier,
        state
      );

      // モックが期待通りに呼び出されたか確認
      sinon.assert.calledOnceWithExactly(discoverStub, config.configurationUrl);
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
        provider: 'oidc',
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
        id_token: 'yyyyy',
        claims: (): IdTokenClaims => ({
          email: 'super_user@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;
      sandbox.stub(repository, 'count').withArgs().resolves(0);

      // テスト対象の関数を呼び出し
      const result = await signinOidc(
        mockClient,
        codeVerifier,
        redirectUri,
        params,
        config
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
        mockTokenSet.claims().email as string
      );
      assert.strictEqual(actual?.authType, AUTH_TYPE.OIDC);
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);
      assert.strictEqual(actual?.oidcAccessToken, mockTokenSet.access_token);
      assert.strictEqual(actual?.oidcIdToken, mockTokenSet.id_token);

      // ロールが正しく設定されているか確認
      const roleIds = await listRoles(actual?.id);
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
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        signinOidc(mockClient, codeVerifier, redirectUri, params, config),
        invalidOidcToken()
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
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        signinOidc(mockClient, codeVerifier, redirectUri, params, config),
        invalidOidcToken()
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
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        signinOidc(mockClient, codeVerifier, redirectUri, params, config),
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
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      await assert.rejects(
        signinOidc(mockClient, codeVerifier, redirectUri, params, config),
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
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      // クライアントのモック
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでにsuperユーザーが存在する状態にする
      await createOne(
        {
          email: 'super@example.com',
          oidcAccessToken: 'xxxxx',
          oidcExpiryDate: 1737455830,
          oidcIdToken: 'yyyyy',
          oidcRefreshToken: null,
          oidcTokenType: 'Bearer',
        },
        AUTH_TYPE.OIDC
      );

      // テスト対象の関数を呼び出し
      const result = await signinOidc(
        mockClient,
        codeVerifier,
        redirectUri,
        params,
        config
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
        mockTokenSet.claims().email as string
      );
      assert.strictEqual(actual?.authType, AUTH_TYPE.OIDC);
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);
      assert.strictEqual(actual?.oidcAccessToken, mockTokenSet.access_token);
      assert.strictEqual(actual?.oidcIdToken, mockTokenSet.id_token);

      // ロールが正しく設定されているか確認
      const roleIds = await listRoles(actual?.id);
      assert.strictEqual(roleIds[0], ADMIN_ROLE.VIEWER);
    });

    it('登録済みユーザーと認証タイプが違うエラー', async () => {
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
          email: 'registered@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      await createOne(
        {
          email: mockTokenSet.claims().email as string,
          oidcAccessToken: 'xxxxx',
          oidcExpiryDate: 1737455830,
          oidcIdToken: 'yyyyy',
          oidcRefreshToken: null,
          oidcTokenType: 'Bearer',
        },
        AUTH_TYPE.GOOGLE
      );

      // テスト対象の関数を呼び出し
      await assert.rejects(
        signinOidc(mockClient, codeVerifier, redirectUri, params, config),
        signinFailed()
      );

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
        expired: (): boolean => false,
      };
      const callbackStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        callback: callbackStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(
        {
          email: mockTokenSet.claims().email as string,
          oidcAccessToken: 'xxxxx',
          oidcExpiryDate: 1737455830,
          oidcIdToken: 'yyyyy',
          oidcRefreshToken: null,
          oidcTokenType: 'Bearer',
        },
        AUTH_TYPE.OIDC
      );
      await addRoleForUser(registeredUser.id, ADMIN_ROLE.VIEWER);

      // signinOidc関数を実行して結果を取得
      await signinOidc(mockClient, codeVerifier, redirectUri, params, config);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(callbackStub, redirectUri, params, {
        code_verifier: codeVerifier,
        state: params.state,
      });

      // ユーザーが正しく更新されたか確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string
      );
      assert.strictEqual(actual?.authType, AUTH_TYPE.OIDC);
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);
      assert.strictEqual(actual?.oidcAccessToken, mockTokenSet.access_token);
      assert.strictEqual(actual?.oidcIdToken, mockTokenSet.id_token);

      // ロールが正しく設定されているか確認
      const roleIds = await listRoles(actual?.id);
      assert.strictEqual(roleIds[0], ADMIN_ROLE.VIEWER);
    });
  });

  describe('verifyOidcAccessToken', () => {
    it('リフレッシュトークンがある場合にアクセストークンをリフレッシュする', async () => {
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
        expired: (): boolean => false,
      };
      const refreshStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        refresh: refreshStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(
        {
          email: mockTokenSet.claims().email as string,
          oidcAccessToken: 'xxxxx',
          oidcExpiryDate: 1737455830,
          oidcIdToken: 'yyyyy',
          oidcRefreshToken: 'zzzzz',
          oidcTokenType: 'Bearer',
        },
        AUTH_TYPE.OIDC
      );

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(
        mockClient,
        registeredUser.id,
        registeredUser
      );

      // 結果の検証
      assert.strictEqual(result, true);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(
        refreshStub,
        registeredUser.oidcRefreshToken
      );

      // ユーザーが正しく更新されたか確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string
      );
      assert.strictEqual(actual?.authType, AUTH_TYPE.OIDC);
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);
      assert.strictEqual(actual?.oidcAccessToken, mockTokenSet.access_token);
      assert.strictEqual(actual?.oidcIdToken, mockTokenSet.id_token);
      assert.strictEqual(actual?.oidcRefreshToken, mockTokenSet.refresh_token);
    });
    it('リフレッシュトークンがある場合にアクセストークンをリフレッシュしてトークンがない場合エラー', async () => {
      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx_updated',
        id_token: 'yyyyy_updated',
        refresh_token: 'zzzzz',
        claims: (): IdTokenClaims => ({
          email: 'verify-access-token-no-token@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const refreshStub = sandbox.stub().returns(null);
      const mockClient = {
        refresh: refreshStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(
        {
          email: mockTokenSet.claims().email as string,
          oidcAccessToken: 'xxxxx',
          oidcExpiryDate: 1737455830,
          oidcIdToken: 'yyyyy',
          oidcRefreshToken: 'zzzzz',
          oidcTokenType: 'Bearer',
        },
        AUTH_TYPE.OIDC
      );

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(
        mockClient,
        registeredUser.id,
        registeredUser
      );

      // 結果の検証
      assert.strictEqual(result, false);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(
        refreshStub,
        registeredUser.oidcRefreshToken
      );

      // ユーザーが更新されないこと確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string
      );
      assert.strictEqual(actual?.authType, AUTH_TYPE.OIDC);
      assert.strictEqual(actual?.email, mockTokenSet.claims().email);
      assert.strictEqual(
        actual?.oidcAccessToken,
        registeredUser.oidcAccessToken
      );
      assert.strictEqual(actual?.oidcIdToken, registeredUser.oidcIdToken);
      assert.strictEqual(
        actual?.oidcRefreshToken,
        registeredUser.oidcRefreshToken
      );
    });
    it('リフレッシュトークンがある場合にアクセストークンの有効期限内はリフレッシュしない', async () => {
      // モックの作成
      const mockTokenSet = {
        access_token: 'xxxxx_updated',
        id_token: 'yyyyy_updated',
        refresh_token: 'zzzzz',
        claims: (): IdTokenClaims => ({
          email: 'verify-access-token-no-refresh@example.com',
          sub: 'sub',
          aud: 'aud',
          exp: 1737455830,
          iat: 1737455830,
          iss: 'iss',
        }),
        expired: (): boolean => false,
      };
      const refreshStub = sandbox.stub().returns(mockTokenSet);
      const mockClient = {
        refresh: refreshStub,
      } as unknown as Client;

      // すでに同じemailでユーザーが存在する状態にする
      const registeredUser = await createOne(
        {
          email: mockTokenSet.claims().email as string,
          oidcAccessToken: 'xxxxx',
          oidcExpiryDate: Date.now() / 1000 + 10 * 60, // 10分後に有効期限切れ
          oidcIdToken: 'yyyyy',
          oidcRefreshToken: 'zzzzz',
          oidcTokenType: 'Bearer',
        },
        AUTH_TYPE.OIDC
      );

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(
        mockClient,
        registeredUser.id,
        registeredUser
      );

      // 結果の検証
      assert.strictEqual(result, true);

      // スタブ呼び出し確認
      sinon.assert.notCalled(refreshStub);

      // ユーザーが更新されていないことを確認
      const actual = await findOneByEmail(
        mockTokenSet.claims().email as string
      );
      assert.strictEqual(actual?.authType, AUTH_TYPE.OIDC);
      assert.strictEqual(actual?.email, registeredUser.email);
      assert.strictEqual(
        actual?.oidcAccessToken,
        registeredUser.oidcAccessToken
      );
      assert.strictEqual(actual?.oidcIdToken, registeredUser.oidcIdToken);
      assert.strictEqual(
        actual?.oidcRefreshToken,
        registeredUser.oidcRefreshToken
      );
    });
    it('リフレッシュトークンとアクセストークンがない場合はエラー', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: null,
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      // モックの作成
      const mockClient = {} as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, false);
    });
    it('リフレッシュトークンがない場合にintrospection_endpointでアクセストークン検証成功する', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      // モックの作成
      const mockIntrospection = {
        active: true,
      };
      const introspectStub = sandbox.stub().resolves(mockIntrospection);
      const mockClient = {
        introspect: introspectStub,
        issuer: {
          metadata: {
            introspection_endpoint: 'https://example.com/introspection',
          },
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, true);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(
        introspectStub,
        user.oidcAccessToken,
        'access_token'
      );
    });
    it('リフレッシュトークンがない場合にintrospection_endpointでアクセストークン検証してactive=falseでエラー', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      const mockIntrospection = {
        active: false,
      };

      // モックの作成
      const introspectStub = sandbox.stub().resolves(mockIntrospection);
      const mockClient = {
        introspect: introspectStub,
        issuer: {
          metadata: {
            introspection_endpoint: 'https://example.com/introspection',
          },
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, false);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(
        introspectStub,
        user.oidcAccessToken,
        'access_token'
      );
    });
    it('リフレッシュトークンがない場合にintrospection_endpointでアクセストークン検証して例外返却でエラー', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      // モックの作成
      const mockIntrospection = new Error('introspect error');
      const introspectStub = sandbox.stub().rejects(mockIntrospection);
      const mockClient = {
        introspect: introspectStub,
        issuer: {
          metadata: {
            introspection_endpoint: 'https://example.com/introspection',
          },
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, false);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(
        introspectStub,
        user.oidcAccessToken,
        'access_token'
      );
    });
    it('リフレッシュトークンがない場合にuserinfo_endpointでユーザー情報が取得できアクセストークンが有効', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';
      const mockUserInfo = {
        sub: 'dummy',
      };

      // モックの作成
      const userInfoStub = sandbox.stub().resolves(mockUserInfo);
      const mockClient = {
        userinfo: userInfoStub,
        issuer: {
          metadata: {
            userinfo_endpoint: 'https://example.com/userinfo',
          },
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, true);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(userInfoStub, user.oidcAccessToken);
    });
    it('リフレッシュトークンがない場合にuserinfo_endpointでユーザー情報取得できないエラー', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      // モックの作成
      const userInfoStub = sandbox.stub().resolves(null);
      const mockClient = {
        userinfo: userInfoStub,
        issuer: {
          metadata: {
            userinfo_endpoint: 'https://example.com/userinfo',
          },
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, false);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(userInfoStub, user.oidcAccessToken);
    });
    it('リフレッシュトークンがない場合にuserinfo_endpointでユーザー情報取得で例外返却されたエラー', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      // モックの作成
      const userInfoStub = sandbox.stub().rejects(new Error('userinfo error'));
      const mockClient = {
        userinfo: userInfoStub,
        issuer: {
          metadata: {
            userinfo_endpoint: 'https://example.com/userinfo',
          },
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, false);

      // スタブ呼び出し確認
      sinon.assert.calledOnceWithExactly(userInfoStub, user.oidcAccessToken);
    });
    it('リフレッシュトークンがない場合にintrospection_endpointとuserinfo_endpointがサポートされてない場合はエラー', async () => {
      // テストデータ
      const user = {
        oidcAccessToken: 'xxxxx',
        oidcExpiryDate: 1737455830,
        oidcIdToken: 'yyyyy',
        oidcRefreshToken: null,
        oidcTokenType: 'Bearer',
      };
      const userId = 'dummy';

      // モックの作成
      const mockClient = {
        issuer: {
          metadata: {},
        },
      } as unknown as Client;

      // テスト対象の関数を呼び出し
      const result = await verifyOidcAccessToken(mockClient, userId, user);

      // 結果の検証
      assert.strictEqual(result, false);
    });
  });
});
