import { google, Auth } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { signJwt } from '.';
import { AUTH_TYPE, GOOGLE_OAUTH2_DEFAULT_SCOPES } from '../../constants';
import {
  googleOAuth2Unavailable,
  invalidGoogleOAuth2Token,
  signinFailed,
} from '../../errors';
import { getDebug } from '../../logging';
import { findOneByEmail } from '../adminuser';
import { createFirstAdminUser } from './common';

const debug = getDebug('domains:auth:googleoauth2');

export interface GoogleOAuthClientConfig {
  clientId: string;
  clientSecret: string;
}

// GoogleOAuth2が有効かどうか
export const isEnabledGoogleOAuth2 = (
  clientConfig: GoogleOAuthClientConfig
): boolean => !!(clientConfig.clientId && clientConfig.clientSecret);

// GoogleOAuth2クライアントを取得
export const getGoogleOAuth2Client = (
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

// GoogleOAuth2認可画面URLを取得
export const getGoogleOAuth2AuthorizationUrl = (
  redirectUrl: string,
  state: string,
  clientConfig: GoogleOAuthClientConfig,
  additionalScopes?: string[]
): string => {
  const client = getGoogleOAuth2Client(clientConfig, redirectUrl);
  const opts = {
    state,
    access_type: 'offline',
    scope: additionalScopes
      ? GOOGLE_OAUTH2_DEFAULT_SCOPES.concat(additionalScopes)
      : GOOGLE_OAUTH2_DEFAULT_SCOPES,
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
  clientConfig: GoogleOAuthClientConfig
): Promise<string> => {
  debug('signinGoogleOAuth2 authentication code: %s', code);
  const client = getGoogleOAuth2Client(clientConfig, redirectUrl);
  const { tokens } = await client.getToken(code);
  const credentials = formatCredentials(tokens);
  if (!credentials.googleOAuth2IdToken) {
    debug('signinGoogleOAuth2 invalid authentication code. %s', code);
    throw invalidGoogleOAuth2Token();
  }
  const loginTicket = await client.verifyIdToken({
    idToken: credentials.googleOAuth2IdToken,
    audience: clientConfig.clientId,
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

  return signJwt(adminUser.id);
};
