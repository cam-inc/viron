import { google, Auth } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { signJwt } from '.';
import {
  AUTH_PROVIDER,
  AUTH_TYPE,
  GOOGLE_OAUTH2_DEFAULT_SCOPES,
} from '../../constants';
import {
  forbidden,
  googleOAuth2Unavailable,
  invalidGoogleOAuth2Token,
  signinFailed,
} from '../../errors';
import { getDebug } from '../../logging';
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
  createViewer,
  formatCredentialsToSsoTokens,
} from './common';
import http from 'http';

const debug = getDebug('domains:auth:googleoauth2');

export interface GoogleOAuthClientConfig {
  clientId: string;
  clientSecret: string;
  issuerUrl: string;
}

export interface GoogleOAuthConfig extends GoogleOAuthClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

// GoogleOAuth2が有効かどうか
export const isEnabledGoogleOAuth2 = (
  clientConfig: GoogleOAuthClientConfig
): boolean => clientConfig.clientId != '' && clientConfig.clientSecret != '';

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
  ssoToken: AdminUserSsoToken
): Promise<Auth.UserRefreshClient> => {
  const client = new google.auth.GoogleAuth().fromJSON({
    type: 'authorized_user',
    client_id: clientConfig.clientId,
    client_secret: clientConfig.clientSecret,
    refresh_token: ssoToken.refreshToken ?? undefined,
  });
  client.credentials = {
    expiry_date: ssoToken.expiryDate,
    access_token: ssoToken.accessToken,
    token_type: ssoToken.tokenType,
    refresh_token: ssoToken.refreshToken,
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
    prompt: 'consent',
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

// Googleサインイン
export const signinGoogleOAuth2 = async (
  req: http.IncomingMessage,
  code: string,
  redirectUrl: string,
  config: GoogleOAuthConfig,
  multipleAuthUser: boolean
): Promise<string> => {
  debug('signinGoogleOAuth2 authentication code: %s', code);
  const client = getGoogleOAuth2Client(config, redirectUrl);
  const { tokens } = await client.getToken(code);
  const ssoTokens = formatCredentialsToSsoTokens(tokens);
  if (!ssoTokens.idToken) {
    debug('signinGoogleOAuth2 invalid authentication code. %s', code);
    throw invalidGoogleOAuth2Token();
  }
  const loginTicket = await client.verifyIdToken({
    idToken: ssoTokens.idToken,
    audience: config.clientId,
  });
  const payload = loginTicket.getPayload();
  const email = payload?.email;
  if (!email) {
    debug(
      'signinGoogleOAuth2 invalid login ticket: %o, idToken: %s',
      loginTicket.getAttributes(),
      ssoTokens.idToken
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

  // emailでユーザーを検索
  let adminUser = await findOneWithCredentialByEmail(email);

  // SSOトークンのUpsert
  const ssoTokenPayload = {
    authType: AUTH_TYPE.OIDC,
    provider: AUTH_PROVIDER.GOOGLE,
    clientId: config.clientId,
    ...ssoTokens,
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
        console.error(
          'signinGoogleOAuth2: user already has password authentication. %s',
          adminUser.email
        );
        throw signinFailed();
      }
      // userIdで登録済みSSOトークン情報を取得
      const ssoTokens = await findSsoTokens({ userId: adminUser.id });
      for (const st of ssoTokens.list) {
        // 今回のclientIDと違うSSOトークンがある場合はエラー
        if (st.clientId !== payload.aud) {
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

  debug('signinGoogleOAuth2 Sign jwt for user: %s', adminUser.id);
  return await signJwt(adminUser.id, req);
};

// アクセストークンの検証
export const verifyGoogleOAuth2AccessToken = async (
  clientId: string,
  userId: string,
  ssoToken: AdminUserSsoToken,
  config: GoogleOAuthConfig
): Promise<boolean> => {
  const client = await getGoogleOAuth2RefreshClient(config, ssoToken);
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
  const newSsoToken = {
    ...formatCredentialsToSsoTokens(accessToken.res.data as Auth.Credentials),
    userId,
    clientId,
    authType: AUTH_TYPE.OIDC,
    provider: AUTH_PROVIDER.GOOGLE,
  } as AdminUserSsoTokenCreatePayload;

  await updateAdminUserSsoTokenOneByUserId(clientId, userId, newSsoToken);
  return true;
};
