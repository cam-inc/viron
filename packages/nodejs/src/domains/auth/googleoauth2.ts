import { google, Auth } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { signJwt } from '.';
import { AUTH_TYPE, GOOGLE_OAUTH2_DEFAULT_SCOPES } from '../../constants';
import {
  forbidden,
  googleOAuth2Unavailable,
  invalidGoogleOAuth2Token,
  signinFailed,
} from '../../errors';
import { getDebug } from '../../logging';
import { findOneByEmail, updateOneById } from '../adminuser';
import { createFirstAdminUser } from './common';

const debug = getDebug('domains:auth:googleoauth2');

export interface GoogleOAuthClientConfig {
  clientId: string;
  clientSecret: string;
}

export interface GoogleOAuthConfig extends GoogleOAuthClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

// GoogleOAuth2が有効かどうか
export const isEnabledGoogleOAuth2 = (
  clientConfig: GoogleOAuthClientConfig
): boolean => !!(clientConfig.clientId && clientConfig.clientSecret);

// GoogleOAuth2クライアントを取得
const getGoogleOAuth2Client = (
  clientConfig: GoogleOAuthClientConfig,
  redirectUrl: string
): Auth.OAuth2Client => {
  if (!isEnabledGoogleOAuth2(clientConfig)) {
    throw googleOAuth2Unavailable();
  }

  return new google.auth.OAuth2(
    clientConfig.clientId,
    clientConfig.clientSecret,
    redirectUrl
  );
};

// GoogleOAuth2リフレッシュ用クライアントを取得
const getGoogleOAuth2RefreshClient = async (
  clientConfig: GoogleOAuthClientConfig,
  credentials: GoogleOAuth2Credentials
): Promise<Auth.UserRefreshClient> => {
  const client = new google.auth.GoogleAuth().fromJSON({
    type: 'authorized_user',
    client_id: clientConfig.clientId,
    client_secret: clientConfig.clientSecret,
    refresh_token: credentials.googleOAuth2RefreshToken ?? undefined,
  });
  client.credentials = {
    expiry_date: credentials.googleOAuth2ExpiryDate,
    access_token: credentials.googleOAuth2AccessToken,
    token_type: credentials.googleOAuth2TokenType,
    refresh_token: credentials.googleOAuth2RefreshToken,
    scope: GOOGLE_OAUTH2_DEFAULT_SCOPES[0],
  };
  return client as Auth.UserRefreshClient;
};

// GoogleOAuth2認可画面URLを取得
export const getGoogleOAuth2AuthorizationUrl = (
  redirectUrl: string,
  state: string,
  config: GoogleOAuthConfig
): string => {
  const client = getGoogleOAuth2Client(config, redirectUrl);
  const opts = {
    state,
    access_type: 'offline',
    scope: config.additionalScopes
      ? GOOGLE_OAUTH2_DEFAULT_SCOPES.concat(config.additionalScopes)
      : GOOGLE_OAUTH2_DEFAULT_SCOPES,
    hd:
      config.userHostedDomains?.length === 1
        ? config.userHostedDomains[0]
        : '*', // 複数指定できないので指定された場合は`*`にしておき、認証後にsigninGoogleOAuth2で弾く
  };
  return client.generateAuthUrl(opts);
};

// ステートを生成
export const genState = (): string => uuidv4();

interface GoogleOAuth2Credentials {
  googleOAuth2AccessToken: string | null;
  googleOAuth2ExpiryDate: number | null;
  googleOAuth2IdToken: string | null;
  googleOAuth2RefreshToken: string | null;
  googleOAuth2TokenType: string | null;
}

const formatCredentials = (
  credentials: Auth.Credentials
): GoogleOAuth2Credentials => {
  return {
    googleOAuth2AccessToken: credentials.access_token ?? null,
    googleOAuth2ExpiryDate: credentials.expiry_date ?? null,
    googleOAuth2IdToken: credentials.id_token ?? null,
    googleOAuth2RefreshToken: credentials.refresh_token ?? null,
    googleOAuth2TokenType: credentials.token_type ?? null,
  };
};

// Googleサインイン
export const signinGoogleOAuth2 = async (
  code: string,
  redirectUrl: string,
  config: GoogleOAuthConfig
): Promise<string> => {
  debug('signinGoogleOAuth2 authentication code: %s', code);
  const client = getGoogleOAuth2Client(config, redirectUrl);
  const { tokens } = await client.getToken(code);
  const credentials = formatCredentials(tokens);
  if (!credentials.googleOAuth2IdToken) {
    debug('signinGoogleOAuth2 invalid authentication code. %s', code);
    throw invalidGoogleOAuth2Token();
  }
  const loginTicket = await client.verifyIdToken({
    idToken: credentials.googleOAuth2IdToken,
    audience: config.clientId,
  });
  const payload = loginTicket.getPayload();
  const email = payload?.email;
  if (!email) {
    debug(
      'signinGoogleOAuth2 invalid login ticket: %o, idToken: %s',
      loginTicket.getAttributes(),
      credentials.googleOAuth2IdToken
    );
    throw invalidGoogleOAuth2Token();
  }
  const emailDomain = email.split('@').pop() as string;
  if (
    config.userHostedDomains?.length &&
    !config.userHostedDomains.includes(emailDomain)
  ) {
    // 許可されていないメールドメイン
    debug('signinGoogleOAuth2 illegal user email: %s', email);
    throw forbidden();
  }

  let adminUser = await findOneByEmail(email);
  if (!adminUser) {
    const firstAdminUser = await createFirstAdminUser(
      { email, ...credentials },
      AUTH_TYPE.GOOGLE
    );
    if (!firstAdminUser) {
      throw signinFailed();
    }
    adminUser = firstAdminUser;
  }
  if (adminUser.authType !== AUTH_TYPE.GOOGLE) {
    throw signinFailed();
  }

  return signJwt(adminUser.id);
};

// アクセストークンの検証
export const verifyGoogleOAuth2AccessToken = async (
  userId: string,
  credentials: GoogleOAuth2Credentials,
  config: GoogleOAuthConfig
): Promise<boolean> => {
  const client = await getGoogleOAuth2RefreshClient(config, credentials);
  const accessToken = await client.getAccessToken().catch((e: Error) => {
    debug('getAccessToken failure. userId: %s, err: %o', userId, e);
    return e;
  });

  // client.getAccessToken内で自動でリフレッシュしてるので、`res`があればリフレッシュ済みとみなす
  if (accessToken instanceof Error || (accessToken.res?.status ?? 0) >= 400) {
    debug('AccessToken refresh failure. userId: %s', userId);
    return false;
  }

  if (!accessToken.res) {
    debug('AccessToken is valid. userId: %s', userId);
    return true;
  }

  debug('AccessToken refresh success! userId: %s', userId);
  const newCredentials = formatCredentials(
    accessToken.res.data as Auth.Credentials
  );
  await updateOneById(userId, newCredentials);
  return true;
};
