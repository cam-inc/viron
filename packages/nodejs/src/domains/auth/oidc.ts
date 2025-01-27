import jwt, { Algorithm, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
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
  invalidOidcIdToken,
  signinFailed,
  unsupportedScope,
} from '../../errors';
import { createOne, findOneByEmail, updateOneById } from '../adminuser';
import { addRoleForUser } from '../adminrole';
import { createFirstAdminUser } from './common';
import {
  ADMIN_ROLE,
  AUTH_TYPE,
  OIDC_DEFAULT_SCOPES,
  OIDC_TOKEN_REFRESH_BEFORE_SEC as OIDC_TOKEN_REFRESH_BUFFER_SEC,
} from '../../constants';

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
    const scopes =
      config.additionalScopes && config.additionalScopes.length > 0
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
    scope:
      config.additionalScopes && config.additionalScopes.length > 0
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
    throw invalidOidcIdToken();
  }

  // emailチェック
  const email = claims.email;
  if (!email) {
    debug(
      'signinOidc invalid login claims: %o, idToken: %s',
      claims,
      tokenSet.id_token
    );
    throw invalidOidcIdToken();
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
  config: OidcConfig,
  userId: string,
  credentials: OidcCredentials
): Promise<boolean> => {
  // credentialsが不正な場合はエラー
  if (
    !credentials.oidcAccessToken ||
    !credentials.oidcIdToken ||
    !credentials.oidcExpiryDate ||
    !credentials.oidcTokenType
  ) {
    debug('verifyOidcAccessToken invalid credentials. %o', credentials);
    return false;
  }

  // IDトークンの検証
  // vironではIDトークンはDBに保存されているので、改竄されることはないが
  // DBはviron利用者が管理するため改竄されることを考慮してvironLibとしてはIDトークンの検証を毎度行う
  const verified = await verifyOidcIdToken(
    client,
    config,
    credentials.oidcIdToken
  );
  if (!verified) {
    debug(
      'verifyOidcAccessToken invalid id token. %s',
      credentials.oidcIdToken
    );
    return false;
  }

  // リフレッシュトークンがない場合はIDトークンの有効期限だけで判定
  if (!credentials.oidcRefreshToken) {
    debug('verifyOidcAccessToken no refresh token. userId: %s', userId);
    return !!verified.exp && verified.exp > Date.now() / 1000;
  }

  // IDトークンの有効期限が近い場合のみリフレッシュする
  if (!isRefresh(verified.exp)) {
    debug('verifyOidcAccessToken no need to refresh token. userId: %s', userId);
    return true;
  }

  // リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
  const refreshToken = credentials.oidcRefreshToken;
  const tokenset = await client.refresh(refreshToken);
  if (!tokenset) {
    debug('verifyOidcAccessToken invalid refresh token. %s', refreshToken);
    return false;
  }
  debug('AccessToken refresh success! userId: %s', userId);

  // トークンを更新
  const newCredentials = formatCredentials(tokenset);
  newCredentials.oidcRefreshToken = refreshToken;
  await updateOneById(userId, newCredentials);

  return true;
};

export const verifyOidcIdToken = async (
  client: Client,
  config: OidcConfig,
  idToken: string
): Promise<JwtPayload | null> => {
  // JWTのヘッダーから`kid`を取得
  const decodedJwt = jwt.decode(idToken, { complete: true });
  if (!decodedJwt || typeof decodedJwt === 'string') {
    debug('verifyIdToken decode error. %s', idToken);
    return null;
  }
  const kid = decodedJwt.header.kid;

  // JWKSエンドポイントから公開鍵を取得
  const keyStore = await client.issuer.keystore();

  // kidに対応する公開鍵を取得
  const key = keyStore.get({ kid });
  if (!key) {
    debug('verifyIdToken invalid kid. %s', kid);
    return null;
  }

  // JWTの検証
  try {
    const verified = jwt.verify(idToken, key.toPEM(), {
      audience: config.clientId, // OIDCクライアントIDで検証
      issuer: client.issuer.metadata.issuer, // トークン発行者で検証
      algorithms: [key.alg as Algorithm], // アルゴリズムを指定
    });
    return verified as JwtPayload;
  } catch (e) {
    debug('verifyIdToken error: %o', e);
    if (e instanceof TokenExpiredError) {
      debug('Token expired! %s', idToken);
      return null;
    }
    throw e;
  }
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

const isRefresh = (expiryDate: number | undefined): boolean => {
  return (
    !expiryDate ||
    Date.now() > (expiryDate - OIDC_TOKEN_REFRESH_BUFFER_SEC) * 1000
  );
};
