import { repositoryContainer } from '../../repositories';
import { getDebug } from '../../logging';

const debug = getDebug('domains:auth:jwt');

export interface RevokedToken {
  id: string;
  token: string;
  revokedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevokedTokenCreateAttributes {
  token: string;
  revokedAt: Date;
}

export interface RevokedTokenUpdateAttributes {
  revokedAt: Date;
}

// サインアウト - tokenを無効化
export const signout = async (token?: string | null): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const repository = repositoryContainer.getRevokedTokenRepository();
  await repository.createOne({ token, revokedAt: new Date() });
  debug('Signout token: %s', token);
  return true;
};

// サインアウト済みか検証
export const isSignedout = async (token?: string | null): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const repository = repositoryContainer.getRevokedTokenRepository();
  return !!(await repository.findOne({ token }));
};
