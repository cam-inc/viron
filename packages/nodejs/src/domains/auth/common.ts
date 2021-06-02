import { AuthType, ADMIN_ROLE } from '../../constants';
import { getDebug } from '../../logging';
import { addRoleForUser } from '../adminrole';
import {
  createOne,
  count,
  AdminUserView,
  AdminUserCreatePayload,
} from '../adminuser';

const debug = getDebug('domains:auth:common');

// 初期ユーザー作成
export const createFirstAdminUser = async (
  obj: AdminUserCreatePayload,
  authType: AuthType
): Promise<AdminUserView | null> => {
  const adminUserNum = await count();
  if (adminUserNum) {
    // すでに管理ユーザーがいる場合は作成しない
    debug('Skip create first admin user.');
    return null;
  }
  const user = await createOne(obj, authType);
  await addRoleForUser(user.id, ADMIN_ROLE.SUPER);
  debug(
    'Created first admin user. id: %s, email: %s, roleId: %s',
    user.id,
    user.email,
    ADMIN_ROLE.SUPER
  );
  return user;
};
