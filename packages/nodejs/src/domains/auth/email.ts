import { AUTH_TYPE } from '../../constants';
import { verifyPassword } from '../../helpers';
import { signinFailed } from '../../errors';
import { findOneByEmail, AdminUserView } from '../adminuser';
import { createFirstAdminUser } from './common';
import { signJwt } from './jwt';

// Emailアドレスでサインイン
export const signinEmail = async (
  email: string,
  password: string
): Promise<string> => {
  // credentialありで取得
  let adminUserWithCredential = await findOneByEmail(email, true);
  if (!adminUserWithCredential) {
    const firstAdminUserWithCredential = await createFirstAdminUser(
      { email, password },
      AUTH_TYPE.EMAIL
    );
    if (!firstAdminUserWithCredential) {
      // 他に管理者がいる場合は発行してもらう必要がある
      throw signinFailed();
    }
    adminUserWithCredential = firstAdminUserWithCredential;
  }

  // credentialsありの型に変換
  const adminUserEmail = adminUserWithCredential as AdminUserView;

  if (
    adminUserEmail.authType !== AUTH_TYPE.EMAIL ||
    !verifyPassword(
      password,
      adminUserEmail.password as string,
      adminUserEmail.salt as string
    )
  ) {
    throw signinFailed();
  }

  return signJwt(adminUserWithCredential.id);
};
