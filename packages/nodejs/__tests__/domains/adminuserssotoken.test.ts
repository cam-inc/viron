import assert from 'assert';
import sinon from 'sinon';
import mongoose from 'mongoose';
import {
  list,
  createOne,
  updateOneByClientIdAndUserId,
  upsertOne,
  removeOneById,
  findOneById,
  count,
  findOneByClientIdAndUserId,
  AdminUserSsoTokenCreatePayload,
  AdminUserSsoTokenUpdatePayload,
  AdminUserSsoToken,
  AdminUserSsoTokenCreateAttributes,
  AdminUserSsoTokenUpdateAttributes,
} from '../../src/domains/adminuserssotoken';
import { Repository, repositoryContainer } from '../../src/repositories';
import { AUTH_PROVIDER, AUTH_TYPE } from '../../src/constants';
import { adminUserSsoTokenNotFound, invalidAuthType } from '../../src/errors';
import { ListWithPager } from '../../src/helpers';

describe('AdminUserSsoToken', () => {
  const sandbox = sinon.createSandbox();
  let repository: Repository<
    AdminUserSsoToken,
    AdminUserSsoTokenCreateAttributes,
    AdminUserSsoTokenUpdateAttributes
  >;

  beforeAll(() => {
    repository = repositoryContainer.getAdminUserSsoTokenRepository();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should list admin user SSO tokens', async () => {
    const conditions = {};
    const size = 10;
    const page = 1;
    const sort = ['createdAt:desc'];
    const expectedResult = {
      list: [
        { id: '1', userId: 'user1', clientId: 'client1' },
        { id: '2', userId: 'user2', clientId: 'client2' },
      ],
      currentPage: 1,
      maxPage: 2,
    } as ListWithPager<AdminUserSsoToken>;

    sandbox
      .stub(repository, 'findWithPager')
      .withArgs(conditions, size, page, sort)
      .resolves(expectedResult);

    const result = await list(conditions, size, page);
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should create a new admin user SSO token', async () => {
    const payload: AdminUserSsoTokenCreatePayload = {
      authType: AUTH_TYPE.OIDC,
      userId: 'user1',
      provider: AUTH_PROVIDER.GOOGLE,
      clientId: 'client1',
      accessToken: 'accessToken',
      expiryDate: Date.now(),
      idToken: 'idToken',
      refreshToken: 'refreshToken',
      tokenType: 'Bearer',
    };
    const expectedResult = {
      ...payload,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox
      .stub(repository, 'createOne')
      .withArgs(payload)
      .resolves(expectedResult);

    const result = await createOne(payload);
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should update an admin user SSO token by clientId and userId', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const payload: AdminUserSsoTokenUpdatePayload = {
      authType: AUTH_TYPE.OIDC,
      userId,
      provider: AUTH_PROVIDER.CUSTOME,
      clientId,
      accessToken: 'newAccessToken',
      expiryDate: Date.now(),
      idToken: 'newIdToken',
      refreshToken: 'newRefreshToken',
      tokenType: 'Bearer',
    };

    sandbox
      .stub(repository, 'findOne')
      .withArgs({ clientId, userId })
      .resolves({ id: '1' } as AdminUserSsoToken);
    sandbox.stub(repository, 'updateOneById').resolves();

    await assert.doesNotReject(
      updateOneByClientIdAndUserId(clientId, userId, payload)
    );
  });

  it('should upsert an admin user SSO token', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const payload: AdminUserSsoTokenCreatePayload = {
      authType: AUTH_TYPE.OIDC,
      userId,
      provider: AUTH_PROVIDER.CUSTOME,
      clientId,
      accessToken: 'accessToken',
      expiryDate: Date.now(),
      idToken: 'idToken',
      refreshToken: 'refreshToken',
      tokenType: 'Bearer',
    };
    const expectedResult = {
      ...payload,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sandbox
      .stub(repository, 'findOne')
      .withArgs({ clientId, userId })
      .resolves(null);
    sandbox
      .stub(repository, 'createOne')
      .withArgs(payload)
      .resolves(expectedResult);

    const result = await upsertOne(payload);
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should upsert an admin user SSO token already', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const clientId = 'client1';
    const userId = 'user1';
    const payload: AdminUserSsoTokenCreatePayload = {
      authType: AUTH_TYPE.OIDC,
      userId,
      provider: AUTH_PROVIDER.CUSTOME,
      clientId,
      accessToken: 'accessToken',
      expiryDate: Date.now(),
      idToken: 'idToken',
      refreshToken: 'refreshToken',
      tokenType: 'Bearer',
    };
    const expectedResult = { ...payload, id } as AdminUserSsoToken;

    sandbox
      .stub(repository, 'findOne')
      .withArgs({ clientId, userId })
      .resolves({
        id,
        userId,
        clientId,
        authType: AUTH_TYPE.OIDC,
        provider: AUTH_PROVIDER.CUSTOME,
        accessToken: 'accessToken',
        expiryDate: Date.now(),
        tokenType: 'Bearer',
      } as AdminUserSsoToken);
    sandbox.stub(repository, 'createOne').resolves(expectedResult);

    const result = await upsertOne(payload);
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should remove an admin user SSO token by id', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const expectedResult = {
      id,
      userId: 'user1',
      clientId: 'client1',
    } as AdminUserSsoToken;

    sandbox
      .stub(repository, 'findOneById')
      .withArgs(id)
      .resolves(expectedResult);

    sandbox.stub(repository, 'removeOneById').withArgs(id).resolves();

    await assert.doesNotReject(removeOneById(id));
  });

  it('should remove an admin user SSO token by id no sso token', async () => {
    const id = new mongoose.Types.ObjectId().toString();

    await assert.rejects(removeOneById(id), adminUserSsoTokenNotFound());
  });

  it('should find an admin user SSO token by id', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const expectedResult = {
      id,
      userId: 'user1',
      clientId: 'client1',
    } as AdminUserSsoToken;

    sandbox
      .stub(repository, 'findOneById')
      .withArgs(id)
      .resolves(expectedResult);

    const result = await findOneById(id);
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should count admin user SSO tokens', async () => {
    const expectedResult = 10;

    sandbox.stub(repository, 'count').resolves(expectedResult);

    const result = await count();
    assert.strictEqual(result, expectedResult);
  });

  it('should find an admin user SSO token by clientId and userId', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const expectedResult = { id: '1', userId, clientId } as AdminUserSsoToken;

    sandbox
      .stub(repository, 'findOne')
      .withArgs({ clientId, userId })
      .resolves(expectedResult);

    const result = await findOneByClientIdAndUserId(clientId, userId);
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should throw an error if admin user SSO token not found when updating', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const payload: AdminUserSsoTokenUpdatePayload = {
      authType: AUTH_TYPE.OIDC,
      userId,
      provider: AUTH_PROVIDER.CUSTOME,
      clientId,
      accessToken: 'newAccessToken',
      expiryDate: Date.now(),
      idToken: 'newIdToken',
      refreshToken: 'newRefreshToken',
      tokenType: 'Bearer',
    };

    sandbox
      .stub(repository, 'findOne')
      .withArgs({ clientId, userId })
      .resolves(null);

    await assert.rejects(
      updateOneByClientIdAndUserId(clientId, userId, payload),
      adminUserSsoTokenNotFound()
    );
  });

  it('should throw an error if invalid auth type when creating', async () => {
    const payload: AdminUserSsoTokenCreatePayload = {
      authType: 'invalid',
      userId: 'user1',
      provider: AUTH_PROVIDER.CUSTOME,
      clientId: 'client1',
      accessToken: 'accessToken',
      expiryDate: Date.now(),
      idToken: 'idToken',
      refreshToken: 'refreshToken',
      tokenType: 'Bearer',
    };

    await assert.rejects(createOne(payload), invalidAuthType());
  });
});
