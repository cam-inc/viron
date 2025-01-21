import {
  Issuer,
  generators,
  Client,
  TokenSet,
  CallbackParamsType,
} from 'openid-client';
import { getDebug } from '../../logging';
import { signJwt } from './jwt';
const debug = getDebug('domains:auth:oidc');
import {
  forbidden,
  invalidOidcToken,
  signinFailed,
  unsupportedScope,
} from '../../errors';
import { createOne, findOneByEmail, updateOneById } from '../adminuser';
import { addRoleForUser } from '../adminrole';
import { createFirstAdminUser } from './common';
import { ADMIN_ROLE, AUTH_TYPE, OIDC_DEFAULT_SCOPES } from '../../constants';

export interface OidcClientConfig {
  clientId: string;
  clientSecret: string;
  configurationUrl: string;
}

export interface OidcConfig extends OidcClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

// OIDCクライアントの生成
export const genOidcClient = async (
  config: OidcConfig,
  redirectUri?: string
): Promise<Client> => {
  // OIDCプロバイダーのIssuerを取得
  const issuer = await Issuer.discover(config.configurationUrl);
  debug('Discovered issuer %o', issuer);

  // issuer.metadata.scopes_supportedでサポートされていないスコープがないかチェック
  // https://openid.net/specs/openid-connect-discovery-1_0.html#IssuerDiscovery
  // RECOMMENDED. JSON array containing a list of the OAuth 2.0 [RFC6749] scope values that this server supports. The server MUST support the openid scope value. Servers MAY choose not to advertise some supported scope values even when this parameter is used, although those defined in [OpenID.Core] SHOULD be listed, if supported.
  // 推奨プロパティなのでない場合もある
  const scopesSupported = issuer.metadata.scopes_supported
    ? (issuer.metadata.scopes_supported as string[])
    : [];
  // scopes_supportedがある場合はチェック
  if (scopesSupported.length > 0) {
    // 追加スコープがある場合は追加スコープを含めてチェック
    const scopes = config.additionalScopes
      ? OIDC_DEFAULT_SCOPES.concat(config.additionalScopes)
      : OIDC_DEFAULT_SCOPES;
    // scopes の中のどれか一つでもサポートされていない場合はエラー
    if (scopes.some((scope) => !scopesSupported.includes(scope))) {
      throw unsupportedScope();
    }
  }

  debug('redirectUri %s', redirectUri);

  // クライアントの作成
  return new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    response_types: ['code'],
    ...(redirectUri && { redirect_uris: [redirectUri] }),
  });
};

// OIDC用のコードベリファイアを生成
export const genOidcCodeVerifier = async (): Promise<string> => {
  return generators.codeVerifier();
};

// Oidc認可画面URLを取得
export const getOidcAuthorizationUrl = async (
  config: OidcConfig,
  client: Client,
  codeVerifier: string,
  state: string
): Promise<string> => {
  // PKCE用のコードベリファイアを生成
  const codeChallenge = generators.codeChallenge(codeVerifier);

  // 認証URLを生成
  const authorizationUrl = client.authorizationUrl({
    scope: config.additionalScopes
      ? OIDC_DEFAULT_SCOPES.concat(config.additionalScopes).join(' ')
      : OIDC_DEFAULT_SCOPES.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  debug('Authorization URL:', authorizationUrl);

  return authorizationUrl;
};

// Oidcサインイン
export const signinOidc = async (
  client: Client,
  codeVerifier: string,
  redirectUri: string,
  params: CallbackParamsType,
  config: OidcConfig
): Promise<string> => {
  debug('params:', params);
  debug('codeVerifier:', codeVerifier);

  const tokenSet = await client.callback(redirectUri, params, {
    code_verifier: codeVerifier,
    state: params.state,
  });

  const claims = tokenSet.claims();
  const credentials = formatCredentials(tokenSet);

  if (!credentials.oidcIdToken) {
    debug('signinOidc invalid authentication codeVerifier. %s', codeVerifier);
    throw invalidOidcToken();
  }

  // emailチェック
  const email = claims.email;
  if (!email) {
    debug(
      'signinOidc invalid login claims: %o, idToken: %s',
      claims,
      tokenSet.id_token
    );
    throw invalidOidcToken();
  }
  // emailドメインチェック
  const emailDomain = email.split('@').pop() as string;
  if (
    config.userHostedDomains?.length &&
    !config.userHostedDomains.includes(emailDomain)
  ) {
    // 許可されていないメールドメイン
    debug('signinOidc illegal user email: %s', email);
    throw forbidden();
  }

  // トークンの有効期限が切れている場合は403
  if (tokenSet.expired()) {
    debug('Token expired!');
    throw forbidden();
  }

  // emailでユーザーを検索
  let adminUser = await findOneByEmail(email);

  // ユーザーが存在しない場合は新規作成
  if (!adminUser) {
    const firstAdminUser = await createFirstAdminUser(
      { email, ...credentials },
      AUTH_TYPE.OIDC
    );
    if (firstAdminUser) {
      adminUser = firstAdminUser;
    } else {
      // 初回ログイン時ユーザー作成
      adminUser = await createOne({ email, ...credentials }, AUTH_TYPE.OIDC);
      await addRoleForUser(adminUser.id, ADMIN_ROLE.VIEWER);
    }
  } else {
    if (adminUser.authType !== AUTH_TYPE.OIDC) {
      throw signinFailed();
    }
    // 既存ユーザーの情報を更新
    await updateOneById(adminUser.id, credentials);
  }

  debug('signinOidc Sign jwt for user: %s', adminUser.id);
  return signJwt(adminUser.id);
};

// アクセストークンの検証
export const verifyOidcAccessToken = async (
  client: Client,
  userId: string,
  credentials: OidcCredentials
): Promise<boolean> => {
  // リフレッシュトークンがない場合はscope offline_accessがサポートされてないのでintrospection_endpoint or userinfo_endpointでアクセストークンの有効性を検証する
  if (!credentials.oidcRefreshToken) {
    if (!credentials.oidcAccessToken) {
      debug(
        'verifyOidcAccessToken invalid access token. %s',
        credentials.oidcAccessToken
      );
      return false;
    }

    const accessToken: string = credentials.oidcAccessToken;
    debug('Access token verification without refreshtoken userId: %s', userId);
    debug('client.issuer.metadata. %o', client.issuer.metadata);

    // introspection_endpointがある場合はアクセストークンを検証
    if (client.issuer.metadata.introspection_endpoint) {
      debug(
        'Accesstoken validation if introspection_endpoint is supported userId: %s',
        userId
      );

      // アクセストークンを検証
      const introspect = await client
        .introspect(accessToken, 'access_token')
        .catch((e: Error) => {
          debug('introspect failure. userId: %s, err: %o', userId, e);
          return e;
        });

      // アクセストークン検証でエラーが発生した場合
      if (introspect instanceof Error) {
        debug(
          'verifyOidcAccessToken introspect invalid access token error. %s',
          accessToken
        );
        return false;
      }

      // アクセストークンが無効な場合
      if (!introspect.active) {
        debug(
          'verifyOidcAccessToken introspect invalid access token deactive. %s',
          credentials.oidcAccessToken
        );
        return false;
      }

      // activeが取得できた場合は有効なアクセストークン
      debug('introspect %o', introspect);
      return true;
    }

    // userinfo_endpointがある場合はアクセストークンを検証
    if (client.issuer.metadata.userinfo_endpoint) {
      debug(
        'Accesstoken validation if userinfo_endpoint is supported userId: %s',
        userId
      );

      // ユーザー情報を取得できた場合は有効なアクセストークン
      const userInfo = await client.userinfo(accessToken).catch((e: Error) => {
        debug('userinfo failure. userId: %s, err: %o', userId, e);
        return e;
      });

      // ユーザー情報取得でエラーが発生した場合
      if (userInfo instanceof Error) {
        debug(
          'verifyOidcAccessToken userinfo invalid access token error. %s, %o',
          accessToken,
          userInfo
        );
        return false;
      }

      // ユーザー情報が取得できなかった場合
      if (!userInfo) {
        debug(
          'verifyOidcAccessToken userinfo invalid access token. %s',
          accessToken
        );
        return false;
      }

      // emailが取得できた場合は有効なアクセストークン
      debug('userinfo.email %o', userInfo.email);
      return true;
    }

    // introspection_endpointとuserinfo_endpointがない場合はアクセストークンを検証できないのでエラー
    debug('introspection_endpoint and userinfo_endpoint are not supported');
    return false;
  }

  // リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
  const refreshToken = credentials.oidcRefreshToken;
  const tokenset = await client.refresh(refreshToken);
  if (!tokenset) {
    debug('verifyOidcAccessToken invalid refresh token. %s', refreshToken);
    return false;
  }
  debug('AccessToken refresh success! userId: %s', userId);
  const newCredentials = formatCredentials(tokenset);
  newCredentials.oidcRefreshToken = refreshToken;
  await updateOneById(userId, newCredentials);
  return true;
};

interface OidcCredentials {
  oidcAccessToken: string | null;
  oidcExpiryDate: number | null;
  oidcIdToken: string | null;
  oidcRefreshToken: string | null;
  oidcTokenType: string | null;
}

const formatCredentials = (credentials: TokenSet): OidcCredentials => {
  return {
    oidcAccessToken: credentials.access_token ?? null,
    oidcExpiryDate: credentials.expires_at ?? null,
    oidcIdToken: credentials.id_token ?? null,
    oidcRefreshToken: credentials.refresh_token ?? null,
    oidcTokenType: credentials.token_type ?? null,
  };
};
