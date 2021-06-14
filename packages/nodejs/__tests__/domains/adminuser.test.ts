import assert from 'assert';
import sinon from 'sinon';
import { AUTH_TYPE } from '../../src/constants';
import {
  AdminUser,
  AdminUserCreateAttributes,
  AdminUserCreatePayload,
  AdminUserUpdateAttributes,
  AdminUserUpdatePayload,
} from '../../src/domains/adminuser';
import * as domainsAdminuser from '../../src/domains/adminuser';
import { genPasswordHash } from '../../src/helpers';
import { Repository, repositoryContainer } from '../../src/repositories';
import { adminUserNotFound } from '../../src/errors';

const {
  count,
  createOne,
  findOneById,
  findOneByEmail,
  list,
  removeOneById,
  updateOneById,
} = domainsAdminuser;

describe('domains/adminuser', () => {
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

  describe('list', () => {
    it('Get list with pager.', async () => {
      sinon.stub(repository, 'findWithPager').resolves({
        list: [
          {
            id: '1',
            email: 'foo@example.com',
            authType: AUTH_TYPE.EMAIL,
            salt: 'xxxxxxxxxx',
            password: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            createdAt: new Date(),
            updatedAt: new Date(),
            googleOAuth2AccessToken: null,
            googleOAuth2ExpiryDate: null,
            googleOAuth2IdToken: null,
            googleOAuth2RefreshToken: null,
            googleOAuth2TokenType: null,
          },
        ],
        maxPage: 1,
        currentPage: 1,
      });
      const result = await list();
      assert.strictEqual(result.list.length, 1);
      assert.strictEqual(result.maxPage, 1);
      assert.strictEqual(result.currentPage, 1);
    });
  });

  describe('createOne', () => {
    it('Return created resource by email user', async () => {
      const data: AdminUserCreatePayload = {
        email: 'foo@exmaple.com',
        password: 'pass',
      };
      const { salt, password } = genPasswordHash(data.password);

      sandbox
        .stub(repository, 'createOne')
        .withArgs(
          sandbox.match({
            email: data.email,
            authType: AUTH_TYPE.EMAIL,
            salt: sandbox.match.string,
            password: sandbox.match.string,
          })
        )
        .resolves({
          id: '1',
          email: data.email,
          authType: AUTH_TYPE.EMAIL,
          salt,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          googleOAuth2AccessToken: null,
          googleOAuth2ExpiryDate: null,
          googleOAuth2IdToken: null,
          googleOAuth2RefreshToken: null,
          googleOAuth2TokenType: null,
        });

      const result = await createOne(data);
      assert.strictEqual(result.id, '1');
      assert.strictEqual(result.roleIds.length, 0);
    });

    it('Return created resource with roleIds', async () => {
      const data: AdminUserCreatePayload = {
        email: 'foo@exmaple.com',
        password: 'pass',
        roleIds: ['editor'],
      };
      const { salt, password } = genPasswordHash(data.password);

      sandbox
        .stub(repository, 'createOne')
        .withArgs(
          sandbox.match({
            email: data.email,
            authType: AUTH_TYPE.EMAIL,
            password: sandbox.match.string,
            salt: sandbox.match.string,
          })
        )
        .resolves({
          id: '1',
          email: data.email,
          authType: AUTH_TYPE.EMAIL,
          salt,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          googleOAuth2AccessToken: null,
          googleOAuth2ExpiryDate: null,
          googleOAuth2IdToken: null,
          googleOAuth2RefreshToken: null,
          googleOAuth2TokenType: null,
        });

      const result = await createOne(data);
      assert.strictEqual(result.id, '1');
      assert.strictEqual(result.roleIds[0], 'editor');
    });
  });

  describe('updateOneById', () => {
    it('Succeeded in update', async () => {
      const id = '1';
      const data: AdminUserUpdatePayload = {
        password: 'pass',
        roleIds: ['operator'],
      };

      sandbox.stub(domainsAdminuser, 'findOneById').withArgs(id).resolves({
        id,
        email: 'test@example.com',
        authType: AUTH_TYPE.EMAIL,
        password: null,
        salt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleIds: [],
        googleOAuth2AccessToken: null,
        googleOAuth2ExpiryDate: null,
        googleOAuth2IdToken: null,
        googleOAuth2RefreshToken: null,
        googleOAuth2TokenType: null,
      });
      sandbox
        .stub(repository, 'updateOneById')
        .withArgs(
          id,
          sandbox.match({
            password: sandbox.match.string,
            salt: sandbox.match.string,
          })
        )
        .resolves();

      await assert.doesNotReject(updateOneById(id, data));
    });

    it('User not found', async () => {
      const id = '1';
      const data: AdminUserUpdatePayload = {
        password: 'pass',
        roleIds: ['operator'],
      };

      sandbox.stub(domainsAdminuser, 'findOneById').withArgs(id).resolves();

      const expects = adminUserNotFound();
      await assert.rejects(updateOneById(id, data), {
        message: expects.message,
        name: expects.name,
        statusCode: expects.statusCode,
      });
    });
  });

  describe('removeOneById', () => {
    it('Succeeded in remove', async () => {
      const id = '1';

      sandbox.stub(domainsAdminuser, 'findOneById').withArgs(id).resolves({
        id,
        email: 'test@example.com',
        authType: AUTH_TYPE.EMAIL,
        password: null,
        salt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleIds: [],
        googleOAuth2AccessToken: null,
        googleOAuth2ExpiryDate: null,
        googleOAuth2IdToken: null,
        googleOAuth2RefreshToken: null,
        googleOAuth2TokenType: null,
      });
      sandbox.stub(repository, 'removeOneById').withArgs(id).resolves();

      await assert.doesNotReject(removeOneById(id));
    });

    it('User not found', async () => {
      const id = '1';

      sandbox.stub(domainsAdminuser, 'findOneById').withArgs(id).resolves();

      const expects = adminUserNotFound();
      await assert.rejects(removeOneById(id), {
        message: expects.message,
        name: expects.name,
        statusCode: expects.statusCode,
      });
    });
  });

  describe('findOneById', () => {
    it('Get an admin user', async () => {
      const id = '1';

      sandbox.stub(repository, 'findOneById').withArgs(id).resolves({
        id,
        email: 'test@example.com',
        authType: AUTH_TYPE.EMAIL,
        password: null,
        salt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        googleOAuth2AccessToken: null,
        googleOAuth2ExpiryDate: null,
        googleOAuth2IdToken: null,
        googleOAuth2RefreshToken: null,
        googleOAuth2TokenType: null,
      });

      const user = await findOneById(id);
      assert(user);
      assert.strictEqual(user.id, id);
      assert.deepStrictEqual(user.roleIds, []);
    });

    it('User not found', async () => {
      const id = '1';

      sandbox.stub(repository, 'findOneById').withArgs(id).resolves();

      const user = await findOneById(id);
      assert.strictEqual(user, null);
    });
  });

  describe('findOneByEmail', () => {
    it('Get an admin user', async () => {
      const email = 'test@example.com';
      const id = '1';

      sandbox
        .stub(repository, 'findOne')
        .withArgs(sinon.match({ email }))
        .resolves({
          id,
          email: 'test@example.com',
          authType: AUTH_TYPE.EMAIL,
          password: null,
          salt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          googleOAuth2AccessToken: null,
          googleOAuth2ExpiryDate: null,
          googleOAuth2IdToken: null,
          googleOAuth2RefreshToken: null,
          googleOAuth2TokenType: null,
        });

      const user = await findOneByEmail(email);
      assert(user);
      assert.strictEqual(user.id, id);
      assert.deepStrictEqual(user.roleIds, []);
    });

    it('User not found', async () => {
      const email = 'test@example.com';

      sandbox
        .stub(repository, 'findOne')
        .withArgs(sinon.match({ email }))
        .resolves();

      const user = await findOneByEmail(email);
      assert.strictEqual(user, null);
    });
  });

  describe('count', () => {
    it('Get number of records', async () => {
      sandbox.stub(repository, 'count').resolves(999);

      const numberOfUsers = await count();
      assert.strictEqual(numberOfUsers, 999);
    });
  });
});
