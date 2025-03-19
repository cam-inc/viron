import { AUTH_TYPE } from '../../constants';
import { verifyPassword } from '../../helpers';
import { signinFailed } from '../../errors';
import { findOneByEmail, AdminUserCreatePayload } from '../adminuser';
import { createFirstAdminUser } from './common';
import { signJwt } from './jwt';
import http from 'http';

// Emailアドレスでサインイン
export const signinEmail = async (
  req: http.IncomingMessage,
  email: string,
  password: string
): Promise<string> => {
  // credentialありで取得
  let adminUser = await findOneByEmail(email, true);
  if (!adminUser) {
    adminUser = await createFirstAdminUser(AUTH_TYPE.EMAIL, {
      email,
      password,
    } as AdminUserCreatePayload);
    if (!adminUser) {
      // 他に管理者がいる場合は発行してもらう必要がある
      throw signinFailed();
    }
  }

  if (
    adminUser?.password ||
    !verifyPassword(
      password,
      adminUser.password as string,
      adminUser.salt as string
    )
  ) {
    throw signinFailed();
  }

  return signJwt(adminUser.id, req);
};
