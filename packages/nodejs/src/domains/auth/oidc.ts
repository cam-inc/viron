import { Issuer, generators, Client, TokenSet, CallbackParamsType } from 'openid-client';
import { getDebug } from '../../logging';
import { signJwt } from './jwt';
const debug = getDebug('domains:auth:oidc');
import {
  forbidden,
  invalidGoogleOAuth2Token,
  signinFailed,
} from '../../errors';
import { createOne, findOneByEmail, updateOneById } from '../adminuser';
import { addRoleForUser } from '../adminrole';
import { createFirstAdminUser } from './common';
import { ADMIN_ROLE, AUTH_TYPE, OIDC_DEFAULT_SCOPES } from '../../constants';

export interface OidcClientConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  configurationUrl: string;
}

export interface OidcConfig extends OidcClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

let oidcClient: Client;

export const getOidcClient = async (
  redirectUrl: string,
  config: OidcConfig
): Promise<Client> => {
  if (oidcClient) {
    return oidcClient;
  }

  // OIDCプロバイダーのIssuerを取得
  const issuer = await Issuer.discover(config.configurationUrl);
  console.log('Discovered issuer %o', issuer);

  // issuer.metadata.scopes_supportedでサポートされていないスコープがないかチェック
  const scopesSupported = issuer.metadata.scopes_supported as string[];
  if (scopesSupported) {
    const scopes = config.additionalScopes ? OIDC_DEFAULT_SCOPES.concat(config.additionalScopes) : OIDC_DEFAULT_SCOPES;
    for (const scope of scopes) {
      if (!scopesSupported.includes(scope)) {
        throw new Error(`Unsupported scope: ${scope}`);
      }
    }
  } else {
    // scopes_supportedが見つからない場合はエラー
    console.log('client.issuer.metadata.scopes_supported is not found');
    throw new Error('client.issuer.metadata.scopes_supported is not found');
  }

  console.log('redirectUrl %s', redirectUrl);

  // クライアントの作成
  oidcClient = new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uris: [redirectUrl],
    response_types: ['code'],
  });

  return oidcClient;
};

export const genOidcCodeVerifier = async (): Promise<string> => {
  // PKCE用のコードベリファイアを生成
  return generators.codeVerifier();
};

// Oidc認可画面URLを取得
export const getOidcAuthorizationUrl = async (
  oidcConfig: OidcConfig,
  client: Client,
  codeVerifier: string,
  state: string
): Promise<string> => {

  // PKCE用のコードベリファイアを生成
  const codeChallenge = generators.codeChallenge(codeVerifier);

  console.log('clinet issuer metadata %o', client.issuer.metadata.scopes_supported);

  // 認証URLを生成
  const authorizationUrl = client.authorizationUrl({
    scope: oidcConfig.additionalScopes
      ? OIDC_DEFAULT_SCOPES.concat(oidcConfig.additionalScopes).join(' ')
      : OIDC_DEFAULT_SCOPES.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  console.log('Authorization URL:', authorizationUrl);

  return authorizationUrl;
};

// Oidcサインイン
export const signinOidc = async (
  client: Client,
  codeVerifier: string,
  params: CallbackParamsType,
  oidcConfig: OidcConfig
): Promise<string> => {

  console.log('params:', params);
  console.log('codeVerifier:', codeVerifier);
  console.log('oidcConfig.callbackUrl:', oidcConfig.callbackUrl);

  const tokenSet = await client.callback(oidcConfig.callbackUrl, params, {
    code_verifier: codeVerifier,
    state: params.state,
  });

  const claims = tokenSet.claims();

  console.log('Token Set:', tokenSet);
  console.log('ID Token Claims:', claims);

  const credentials = formatCredentials(tokenSet);

  console.log('create credentials ', credentials);

  if (!credentials.oidcIdToken) {
    debug('signinOidc invalid authentication codeVerifier. %s', codeVerifier);
    throw invalidGoogleOAuth2Token();
  }

  // emailチェック
  const email = claims.email;
  if (!email) {
    debug(
      'signinOidc invalid login claims: %o, idToken: %s',
      claims,
      tokenSet.id_token
    );
    throw invalidGoogleOAuth2Token();
  }
  // emailドメインチェック
  const emailDomain = claims.email!.split('@').pop() as string;
  if (
    oidcConfig.userHostedDomains?.length &&
    !oidcConfig.userHostedDomains.includes(emailDomain)
  ) {
    // 許可されていないメールドメイン
    debug('signinOidc illegal user email: %s', email);
    throw forbidden();
  }

  if (tokenSet.expired()) {
    console.log('Token expired!');
  }

  let adminUser = await findOneByEmail(email);
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
  }
  if (adminUser.authType !== AUTH_TYPE.OIDC) {
    throw signinFailed();
  }

  debug('signinOidc Sign jwt for user: %s', adminUser.id);
  return signJwt(adminUser.id);
};

// アクセストークンの検証
export const verifyOidcAccessToken = async (
  client: Client,
  userId: string,
  credentials: OidcCredentials,
): Promise<boolean> => {

  // リフレッシュトークンがない場合はscope offline_accessがサポートされてないのでintrospection_endpoint or userinfo_endpointでアクセストークンの有効性を検証する
  if (!credentials.oidcRefreshToken) {
    debug('Access token verification without refreshtoken userId: %s', userId);
    debug('client.issuer.metadata. %o', client.issuer.metadata);

    // introspection_endpointがある場合はアクセストークンを検証
    if (client.issuer.metadata.introspection_endpoint) {
      debug('Accesstoken validation if introspection_endpoint is supported userId: %s', userId);

      // アクセストークンを検証
      const introspect = await client.introspect(credentials.oidcAccessToken!, 'access_token').catch((e: Error) => {
        debug('introspect failure. userId: %s, err: %o', userId, e);
        return e;
      });

      // アクセストークン検証でエラーが発生した場合
      if (introspect instanceof Error) {
        debug('verifyOidcAccessToken introspect invalid access token error. %s', credentials.oidcAccessToken);
        return false;
      }

      // アクセストークンが無効な場合
      if (!introspect.active) {
        debug('verifyOidcAccessToken introspect invalid access token deactive. %s', credentials.oidcAccessToken);
        return false;
      }

      // activeが取得できた場合は有効なアクセストークン
      debug('introspect %o', introspect);
      return true;
    }

    // userinfo_endpointがある場合はアクセストークンを検証
    if (client.issuer.metadata.userinfo_endpoint) {
      debug('Accesstoken validation if userinfo_endpoint is supported userId: %s', userId);

      // ユーザー情報を取得できた場合は有効なアクセストークン
      const userInfo = await client.userinfo(credentials.oidcAccessToken!).catch((e: Error) => {
        debug('userinfo failure. userId: %s, err: %o', userId, e);
        return e;
      });

      // ユーザー情報取得でエラーが発生した場合
      if (userInfo instanceof Error) {
        debug('verifyOidcAccessToken userinfo invalid access token error. %s, %o', credentials.oidcAccessToken, userInfo);
        return false;
      }

      // ユーザー情報が取得できなかった場合
      if (!userInfo) {
        debug('verifyOidcAccessToken userinfo invalid access token. %s', credentials.oidcAccessToken);
        return false;
      }

      // emailが取得できた場合は有効なアクセストークン
      debug('userinfo.email %o', userInfo.email);
      return true;
    }

    // introspection_endpointとuserinfo_endpointがない場合はアクセストークンを検証できないのでエラー
    debug('introspection_endpoint and userinfo_endpoint are not supported')
    return false;
  }

  // リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
  const tokenset = await client.refresh(credentials.oidcRefreshToken!);
  console.log('refresh token set:', tokenset);
  if (!tokenset) {
    debug('verifyOidcAccessToken invalid refresh token. %s', credentials.oidcRefreshToken);
    return false;
  }
  debug('AccessToken refresh success! userId: %s', userId);
  const newCredentials = formatCredentials(tokenset);
  newCredentials.oidcRefreshToken = credentials.oidcRefreshToken;
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
