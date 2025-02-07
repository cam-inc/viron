import { AuthType, ADMIN_ROLE } from '../../constants';
import { getDebug } from '../../logging';
import { addRoleForUser } from '../adminrole';
import {
  createOne,
  count,
  AdminUserWithCredential,
  AdminUserCreatePayload,
  AdminUserView,
} from '../adminuser';

const debug = getDebug('domains:auth:common');

// 初期ユーザー作成
export const createFirstAdminUser = async (
  obj: AdminUserCreatePayload,
  authType: AuthType
): Promise<AdminUserWithCredential | AdminUserView | null> => {
  const adminUserNum = await count();
  if (adminUserNum) {
    // すでに管理ユーザーがいる場合は作成しない
    debug('Skip create first admin user.');
    return null;
  }
  // 作成後にcredentialsありで返却
  const userWithCredential = await createOne(obj, authType, true);
  await addRoleForUser(userWithCredential.id, ADMIN_ROLE.SUPER);
  debug(
    'Created first admin user. id: %s, email: %s, roleId: %s',
    userWithCredential.id,
    userWithCredential.email,
    ADMIN_ROLE.SUPER
  );
  return userWithCredential;
};
