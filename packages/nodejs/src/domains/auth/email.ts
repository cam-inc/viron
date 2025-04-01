import { AUTH_TYPE } from '../../constants';
import { verifyPassword } from '../../helpers';
import { signinFailed } from '../../errors';
import { findOneWithCredentialByEmail } from '../adminuser';
import { createFirstAdminUser } from './common';
import { signJwt } from './jwt';
import http from 'http';

export interface EmailConfig {
  jwt: {
    issuer: string;
    audience: string;
  };
}

// Emailアドレスでサインイン
export const signinEmail = async (
  req: http.IncomingMessage,
  email: string,
  password: string
): Promise<string> => {
  // credentialありで取得
  let adminUser = await findOneWithCredentialByEmail(email);
  if (!adminUser) {
    adminUser = await createFirstAdminUser(AUTH_TYPE.EMAIL, {
      email,
      password,
    });
    if (!adminUser) {
      // 他に管理者がいる場合は発行してもらう必要がある
      console.error(
        'No admin user found. Please contact the administrator to create an account.'
      );
      throw signinFailed();
    }
  }

  if (
    !adminUser.password ||
    !adminUser.salt ||
    !verifyPassword(password, adminUser.password, adminUser.salt)
  ) {
    console.error('Invalid password');
    throw signinFailed();
  }

  return signJwt(adminUser.id, req);
};
