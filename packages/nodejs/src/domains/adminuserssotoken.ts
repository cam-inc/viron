import {
  AUTH_PROVIDER,
  AUTH_TYPE,
  TABLE_SORT_DELIMITER,
  TABLE_SORT_ORDER,
} from '../constants';
import { ListWithPager } from '../helpers';
import { FindConditions, repositoryContainer } from '../repositories';
import { adminUserSsoTokenNotFound, invalidAuthType } from '../errors';

export interface AdminUserSsoToken {
  id: string;
  userId: string;
  provider: string;
  clientId: string;
  authType: string;
  accessToken: string;
  expiryDate: number;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserSsoTokenCreateAttributes {
  authType: string;
  userId: string;
  provider: string;
  clientId: string;
  accessToken: string;
  expiryDate: number;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
}

export interface AdminUserSsoTokenUpdateAttributes {
  authType: string;
  userId: string;
  provider: string;
  clientId: string;
  accessToken: string;
  expiryDate: number;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
}

export interface AdminUserSsoTokenCreatePayload {
  authType: string;
  userId: string;
  provider: string;
  clientId: string;
  accessToken: string;
  expiryDate: number;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
}

export interface AdminUserSsoTokenUpdatePayload {
  authType: string;
  userId: string;
  provider: string;
  clientId: string;
  accessToken: string;
  expiryDate: number;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
}

// 一覧取得
export const list = async (
  conditions: FindConditions<AdminUserSsoToken>,
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<AdminUserSsoToken>> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();
  return await repository.findWithPager(conditions, size, page, sort);
};

// 1件作成
export async function createOne(
  payload: AdminUserSsoTokenCreatePayload
): Promise<AdminUserSsoToken> {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();

  if (
    (payload.provider === AUTH_PROVIDER.CUSTOME ||
      payload.provider === AUTH_PROVIDER.GOOGLE) &&
    payload.authType === AUTH_TYPE.OIDC
  ) {
    const ret = await repository.createOne(payload);
    return ret;
  }

  throw invalidAuthType();
}

// IDで1件更新
export const updateOneByClientIdAndUserId = async (
  clientId: string,
  userId: string,
  payload: AdminUserSsoTokenUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();
  const ssoToken = await findOneByClientIdAndUserId(clientId, userId);
  if (!ssoToken) {
    console.error(
      'updateOneByClientIdAndUserId: SSO token not found. clientId: %s, userId: %s',
      clientId,
      userId
    );
    throw adminUserSsoTokenNotFound();
  }

  await repository.updateOneById(ssoToken.id, payload);
};

// upsert
export const upsertOne = async (
  payload: AdminUserSsoTokenCreatePayload
): Promise<AdminUserSsoToken> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();

  const ssoToken = await repository.findOne({
    userId: payload.userId,
    clientId: payload.clientId,
  });
  if (ssoToken) {
    await repository.updateOneById(ssoToken.id, payload);
    return {
      ...ssoToken,
      ...payload,
    };
  }

  return await repository.createOne(payload);
};

// IDで1件削除
export const removeAllByUserId = async (userId: string): Promise<void> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();
  const ssoTokens = await repository.find({ userId });

  if (ssoTokens.length > 0) {
    await Promise.all(
      ssoTokens.map((ssoToken) => {
        return repository.removeOneById(ssoToken.id);
      })
    );
  }
};

// IDで1件取得
export const findOneById = async (
  id: string
): Promise<AdminUserSsoToken | null> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();
  return await repository.findOneById(id);
};

// 件数取得
export const count = async (): Promise<number> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();
  return await repository.count();
};

// clientIdとuserIdで1件取得
export const findOneByClientIdAndUserId = async (
  clientId: string,
  userId: string
): Promise<AdminUserSsoToken | null> => {
  const repository = repositoryContainer.getAdminUserSsoTokenRepository();
  return await repository.findOne({ clientId, userId });
};
