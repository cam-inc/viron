import { AUTH_TYPE } from '../../constants';
import { verifyPassword } from '../../helpers';
import { signinFailed } from '../../errors';
import { findOneByEmail } from '../adminuser';
import { createFirstAdminUser } from './common';
import { signJwt } from './jwt';

// Emailアドレスでサインイン
export const signinEmail = async (
  email: string,
  password: string
): Promise<string> => {
  // credentialありで取得
  let adminUser = await findOneByEmail(email, true);
  if (!adminUser) {
    const firstAdminUser = await createFirstAdminUser(
      { email, password },
      AUTH_TYPE.EMAIL
    );
    if (!firstAdminUser) {
      // 他に管理者がいる場合は発行してもらう必要がある
      throw signinFailed();
    }
    adminUser = firstAdminUser;
  }

  if (
    adminUser.authType !== AUTH_TYPE.EMAIL ||
    !verifyPassword(
      password,
      adminUser.password as string,
      adminUser.salt as string
    )
  ) {
    throw signinFailed();
  }

  return signJwt(adminUser.id);
};
