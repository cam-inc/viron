import assert from 'assert';
import sinon from 'sinon';
import { listById, updateOneById } from '../../src/domains/adminaccount';
import * as domainsAdminaAcount from '../../src/domains/adminaccount';
import { Repository, repositoryContainer } from '../../src/repositories';
import {
  AdminUser,
  AdminUserCreateAttributes,
  AdminUserUpdateAttributes,
} from '../../src/domains/adminuser';
import { adminUserNotFound, forbidden } from '../../src/errors';

describe('domains/adminaccount', () => {
  const sandbox = sinon.createSandbox();

  let repository: Repository<
    AdminUser,
    AdminUserCreateAttributes,
    AdminUserUpdateAttributes
  >;

  beforeAll(() => {
    repository = repositoryContainer.getAdminUserRepository();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('listById', () => {
    it('ID指定の一覧で一件取得', async () => {
      const id = '1';
      sandbox.stub(repository, 'findWithPager').resolves({
        list: [
          {
            id,
            email: 'foo@example.com',
            salt: 'xxxxxxxxxx',
            password: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        maxPage: 1,
        currentPage: 1,
      });
      const result = await listById(id);
      assert.strictEqual(result.list.length, 1);
      assert.strictEqual(result.maxPage, 1);
      assert.strictEqual(result.currentPage, 1);
    });
  });

  describe('updateOneById', () => {
    it('ID指定で更新成功', async () => {
      const id = '1';
      sandbox
        .stub(repository, 'updateOneById')
        .withArgs(id, { password: 'pass' })
        .resolves();

      sandbox
        .stub(repository, 'findOneById')
        .withArgs(id)
        .resolves({
          id,
          email: 'test@example.com',
          salt: 'xxxxxxxxxx',
          password: 'XXXXXXXXXXXXXXXX',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as AdminUser);

      const updatePayload = {
        password: 'pass',
      } as domainsAdminaAcount.AdminAccountUpdatePayload;

      updateOneById(id, updatePayload);
    });
    it('ID指定で更新失敗 パスワードなしユーザーはSSO認証ユーザーなのでパスワード更新させない', async () => {
      const id = '1';
      sandbox
        .stub(repository, 'updateOneById')
        .withArgs(id, { password: 'pass' })
        .resolves();

      sandbox
        .stub(repository, 'findOneById')
        .withArgs(id)
        .resolves({
          id,
          email: 'test@example.com',
          salt: 'xxxxxxxxxx',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as AdminUser);

      const updatePayload = {
        password: 'pass',
      } as domainsAdminaAcount.AdminAccountUpdatePayload;

      assert.rejects(updateOneById(id, updatePayload), forbidden());
    });
    it('ID指定で更新失敗 指定IDのユーザーが存在しない', async () => {
      const id = '1';
      sandbox
        .stub(repository, 'updateOneById')
        .withArgs(id, { password: 'pass' })
        .resolves();

      sandbox.stub(repository, 'findOneById').withArgs(id).resolves(null);

      const updatePayload = {
        password: 'pass',
      } as domainsAdminaAcount.AdminAccountUpdatePayload;

      assert.rejects(updateOneById(id, updatePayload), adminUserNotFound());
    });
  });
});
