import jwt, { Algorithm, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Issuer, generators, Client, CallbackParamsType } from 'openid-client';
import { getDebug } from '../../logging';
import { signJwt } from './jwt';
const debug = getDebug('domains:auth:oidc');
import {
  forbidden,
  invalidOidcIdToken,
  signinFailed,
  unsupportedScope,
  faildDecodeOidcIdToken,
  mismatchKidOidcIdToken,
} from '../../errors';
import {
  AdminUserCreatePayload,
  findOneWithCredentialByEmail,
} from '../adminuser';
import {
  AdminUserSsoToken,
  AdminUserSsoTokenCreatePayload,
  list as findSsoTokens,
  upsertOne as upsertAdminUserSsoToken,
  updateOneByClientIdAndUserId as updateAdminUserSsoTokenOneByUserId,
} from '../adminuserssotoken';
import {
  createFirstAdminUser,
  formatTokenSetToSsoTokens,
  createViewer,
} from './common';
import {
  AUTH_PROVIDER,
  AUTH_TYPE,
  OIDC_DEFAULT_SCOPES,
  OIDC_TOKEN_REFRESH_BEFORE_SEC as OIDC_TOKEN_REFRESH_BUFFER_SEC,
} from '../../constants';
import http from 'http';

export interface OidcClientConfig {
  clientId: string;
  clientSecret: string;
  issuerUrl: string;
}

export interface OidcConfig extends OidcClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

// キャッシュされたOIDCクライアント
let cachedOidcClient: Client | null = null;

// OIDCクライアントの生成
export const genOidcClient = async (
  config: OidcConfig,
  redirectUri?: string,
  forceReload?: boolean
): Promise<Client> => {
  // forceReloadがtrueでない場合にキャッシュを使用
  if (cachedOidcClient && !forceReload) {
    debug('Use cached oidcClient');
    return cachedOidcClient;
  }

  // OIDCプロバイダーのIssuerを取得
  const issuer = await Issuer.discover(
    config.issuerUrl + '/.well-known/openid-configuration'
  );
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

  // クライアントの作成とキャッシュ
  const oidcClient = new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    response_types: ['code'],
    ...(redirectUri && { redirect_uris: [redirectUri] }),
  });

  // redirectUriが指定されている場合のみキャッシュ
  if (redirectUri) {
    cachedOidcClient = oidcClient;
  }

  return oidcClient;
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
  req: http.IncomingMessage,
  client: Client,
  codeVerifier: string,
  redirectUri: string,
  params: CallbackParamsType,
  config: OidcConfig,
  multipleAuthUser: boolean
): Promise<string> => {
  debug('params:', params);
  debug('codeVerifier:', codeVerifier);

  const tokenSet = await client.callback(redirectUri, params, {
    code_verifier: codeVerifier,
    state: params.state,
  });

  const claims = tokenSet.claims();
  const ssoToken = formatTokenSetToSsoTokens(tokenSet);

  if (ssoToken.idToken === '') {
    debug(
      'signinOidc invalid authentication codeVerifier. %s, %o',
      codeVerifier,
      ssoToken
    );
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
  let adminUser = await findOneWithCredentialByEmail(email);

  // SSOトークンのUpsert
  const ssoTokenPayload = {
    authType: AUTH_TYPE.OIDC,
    provider: AUTH_PROVIDER.CUSTOM,
    clientId: config.clientId,
    ...ssoToken,
  } as AdminUserSsoTokenCreatePayload;

  // ユーザーが存在しない場合は新規作成
  if (!adminUser) {
    const adminUserCreatePayload: AdminUserCreatePayload = { email };

    // 最初ログイン時ユーザー作成(SUPER)
    adminUser = await createFirstAdminUser(
      AUTH_TYPE.OIDC,
      adminUserCreatePayload,
      ssoTokenPayload
    );

    // 管理者ユーザー存在する場合はviewerユーザー作成
    if (!adminUser) {
      adminUser = await createViewer(
        AUTH_TYPE.OIDC,
        adminUserCreatePayload,
        ssoTokenPayload
      );
    }
  } else {
    // userが存在する場合
    // multipleAuthUser=falseの場合は認証方法は1つのみに制限する
    if (!multipleAuthUser) {
      // 登録済みユーザーの認証方法の確認
      // password認証が登録済みの場合はエラー
      if (adminUser.password && adminUser.password !== '') {
        console.error('signinFailed password auth already', adminUser.id);
        throw signinFailed();
      }
      // userIdで登録済みSSOトークン情報を取得
      const ssoTokens = await findSsoTokens({ userId: adminUser.id });
      for (const st of ssoTokens.list) {
        // 今回のclientIDと違うSSOトークンがある場合はエラー
        if (st.clientId !== claims.aud) {
          console.error('signinFailed clientId already');
          throw signinFailed();
        }
      }
    }

    // SSOトークンのUserIDを設定
    ssoTokenPayload.userId = adminUser.id;

    // ここまででエラーがない場合はSSOトークンのUpsert
    upsertAdminUserSsoToken(ssoTokenPayload);
  }

  debug('signinOidc Sign jwt for user: %s', adminUser.id);
  return signJwt(adminUser.id, req);
};

// アクセストークンの検証
export const verifyOidcAccessToken = async (
  client: Client,
  config: OidcConfig,
  clientId: string,
  userId: string,
  ssoToken: AdminUserSsoToken
): Promise<boolean> => {
  // IDトークンの検証
  // vironではIDトークンはDBに保存されているので、改竄されることはないが
  // DBはviron利用者が管理するため改竄されることを考慮してvironLibとしてはIDトークンの検証を毎度行う
  const verified = await verifyOidcIdToken(
    client,
    config,
    ssoToken.idToken
  ).catch((e: Error) => {
    debug('verifyOidcIdToken failure. userId: %s, err: %o', userId, e);
    return e;
  });
  // IDトークンの検証に失敗した場合はエラー
  if (verified instanceof Error) {
    return false;
  }

  // リフレッシュトークンがない場合はIDトークンの有効期限だけで判定
  if (!ssoToken.refreshToken) {
    debug('verifyOidcAccessToken no refresh token. userId: %s', userId);
    // IDトークンの有効期限が切れている場合はエラー
    return !verified.expired;
  }

  // ---- 以下リフレッシュトークンがある場合の処理 ----
  // IDトークンの有効期限が近いもしくは期限切れ場合以外はリフレッシュしない
  if (!isRefresh(verified.payload.exp)) {
    debug('verifyOidcAccessToken no need to refresh token. userId: %s', userId);
    return true;
  }

  // リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
  const refreshToken = ssoToken.refreshToken;
  const tokenset = await client.refresh(refreshToken).catch((e: Error) => {
    debug('AccessToken refresh failure. userId: %s, err: %o', userId, e);
    return e;
  });
  // アクセストークンのリフレッシュに失敗した場合はエラー
  if (tokenset instanceof Error) {
    return false;
  }
  debug('AccessToken refresh success! userId: %s', userId);

  // トークンを更新
  const newSsoToken = {
    ...formatTokenSetToSsoTokens(tokenset),
    userId,
    clientId,
    authType: AUTH_TYPE.OIDC,
    provider: AUTH_PROVIDER.CUSTOM,
  } as AdminUserSsoTokenCreatePayload;

  await updateAdminUserSsoTokenOneByUserId(clientId, userId, newSsoToken);
  return true;
};

/**
 * IDトークンの検証
 * 有効期限切れ以外の例外はスローする
 *
 * @param client
 * @param config
 * @param idToken
 * @returns {Promise<{decodedJwt: Jwt, isExpired: boolean}>} デコードしたJWTと期限切れ判定を返す
 */
export const verifyOidcIdToken = async (
  client: Client,
  config: OidcConfig,
  idToken: string
): Promise<{ payload: JwtPayload; expired: boolean }> => {
  // JWTのヘッダーから`kid`を取得
  const decodedJwt = jwt.decode(idToken, { complete: true });
  if (decodedJwt === null || typeof decodedJwt.payload === 'string') {
    // JWTのデコードに失敗した場合は設定不備 or 改竄された可能性があるため500エラー
    debug('verifyIdToken decode error. %s', idToken);
    throw faildDecodeOidcIdToken();
  }
  const kid = decodedJwt.header.kid;

  // JWKSエンドポイントから公開鍵を取得
  const keyStore = await client.issuer.keystore();

  // kidに対応する公開鍵を取得
  const key = keyStore.get({ kid });
  if (!key) {
    // kidに対応する公開鍵がない場合は500エラー
    debug('verifyIdToken mismatch kid. %s', kid);
    throw mismatchKidOidcIdToken();
  }

  // JWTの検証
  try {
    jwt.verify(idToken, key.toPEM(), {
      audience: config.clientId, // OIDCクライアントIDで検証
      issuer: client.issuer.metadata.issuer, // トークン発行者で検証
      algorithms: [key.alg as Algorithm], // アルゴリズムを指定
    });
    // 検証成功の場合はpayloadと期限切れフラグをfalseで返す
    return { payload: decodedJwt.payload as JwtPayload, expired: false };
  } catch (e) {
    debug('verifyIdToken error: %o', e);
    // トークンの有効期限切れの場合のみpayloadと期限切れフラグをtrueで返す
    if (e instanceof TokenExpiredError) {
      debug('Token expired! %s', idToken);
      return { payload: decodedJwt.payload as JwtPayload, expired: true };
    }
    // トークンの有効期限切れ以外は設定不備 or 改竄された可能性があるため500エラー
    throw e;
  }
};

const isRefresh = (expiryDate: number | undefined): boolean => {
  return (
    !expiryDate ||
    Date.now() > (expiryDate - OIDC_TOKEN_REFRESH_BUFFER_SEC) * 1000
  );
};
