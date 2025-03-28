import {
  AdminUserSsoTokenCreatePayload,
  createOne as createOneSsoToken,
} from '../adminuserssotoken';
import { AuthType, ADMIN_ROLE, AUTH_TYPE } from '../../constants';
import { getDebug } from '../../logging';
import { addRoleForUser } from '../adminrole';
import {
  count,
  AdminUserWithCredential,
  AdminUserCreatePayload,
  createOneWithCredential,
} from '../adminuser';
import { TokenSet } from 'openid-client';
import { Auth } from 'googleapis';

const debug = getDebug('domains:auth:common');

// 初期 管理者ユーザー作成 (SUPER)
export const createFirstAdminUser = async (
  authType: AuthType,
  adminUserPayload: AdminUserCreatePayload,
  adminUserSsoTokenPayload?: AdminUserSsoTokenCreatePayload
): Promise<AdminUserWithCredential | null> => {
  const adminUserNum = await count();
  if (adminUserNum) {
    // すでに管理ユーザーがいる場合は作成しない
    debug('Skip create first admin user.');
    return null;
  }
  return createAdminUser(
    authType,
    adminUserPayload,
    ADMIN_ROLE.SUPER,
    adminUserSsoTokenPayload
  );
};

// 管理者ユーザー作成 (VIEWER)
export const createViewer = async (
  authType: AuthType,
  adminUserPayload: AdminUserCreatePayload,
  adminUserSsoTokenPayload?: AdminUserSsoTokenCreatePayload
): Promise<AdminUserWithCredential> => {
  return createAdminUser(
    authType,
    adminUserPayload,
    ADMIN_ROLE.VIEWER,
    adminUserSsoTokenPayload
  );
};

// 管理者ユーザー作成
export const createAdminUser = async (
  authType: AuthType,
  adminUserPayload: AdminUserCreatePayload,
  roleId: string,
  adminUserSsoTokenPayload?: AdminUserSsoTokenCreatePayload
): Promise<AdminUserWithCredential> => {
  // 作成後にcredentialsありで返却
  const userWithCredential = await createOneWithCredential(adminUserPayload);

  // SSOトークンを作成
  if (authType === AUTH_TYPE.OIDC && adminUserSsoTokenPayload) {
    adminUserSsoTokenPayload.userId = userWithCredential.id;
    await createOneSsoToken(adminUserSsoTokenPayload);
  }

  await addRoleForUser(userWithCredential.id, roleId);
  debug(
    'Created first admin user. id: %s, email: %s, roleId: %s',
    userWithCredential.id,
    userWithCredential.email,
    ADMIN_ROLE.SUPER
  );
  return userWithCredential as AdminUserWithCredential;
};

interface SsoTokens {
  accessToken: string;
  expiryDate: number;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
}

export const formatTokenSetToSsoTokens = (tokenSet: TokenSet): SsoTokens => {
  return {
    accessToken: tokenSet.access_token ?? '',
    expiryDate: tokenSet.expires_at ?? 0,
    idToken: tokenSet.id_token ?? '',
    refreshToken: tokenSet.refresh_token ?? null,
    tokenType: tokenSet.token_type ?? '',
  };
};

export const formatCredentialsToSsoTokens = (
  credentials: Auth.Credentials
): SsoTokens => {
  return {
    accessToken: credentials.access_token ?? '',
    expiryDate: credentials.expiry_date ?? 0,
    idToken: credentials.id_token ?? '',
    refreshToken: credentials.refresh_token ?? null,
    tokenType: credentials.token_type ?? '',
  };
};
