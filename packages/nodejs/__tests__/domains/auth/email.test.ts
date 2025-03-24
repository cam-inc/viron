import assert from 'assert';
import sinon from 'sinon';
import http from 'http';
import { signinEmail } from '../../../src/domains/auth/email';
import * as domainsAdminUser from '../../../src/domains/adminuser';
import * as domainsAuthCommon from '../../../src/domains/auth/common';
import * as helper from '../../../src/helpers/password';
import * as domainsAuthJwt from '../../../src/domains/auth/jwt';
import { AUTH_TYPE } from '../../../src/constants';
import { signinFailed } from '../../../src/errors';

describe('signinEmail', () => {
  const sandbox = sinon.createSandbox();
  const req = {} as http.IncomingMessage;

  afterEach(() => {
    sandbox.restore();
  });

  it('should sign in successfully with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const token = 'token';

    sandbox
      .stub(domainsAdminUser, 'findOneByEmail')
      .withArgs(email)
      .resolves({
        id: '1',
        email,
        password: 'hashedPassword',
        salt: 'salt',
        roleIds: ['admin'],
      } as domainsAdminUser.AdminUserWithCredential);

    sandbox
      .stub(helper, 'verifyPassword')
      .withArgs(password, 'hashedPassword', 'salt')
      .returns(true);

    sandbox.stub(domainsAuthJwt, 'signJwt').withArgs('1', req).resolves(token);

    const result = await signinEmail(req, email, password);
    assert.strictEqual(result, token);
  });

  it('should create a new admin user if not found', async () => {
    const email = 'newuser@example.com';
    const password = 'password';
    const token = 'token';

    sandbox
      .stub(domainsAdminUser, 'findOneByEmail')
      .withArgs(email)
      .resolves(null);

    sandbox
      .stub(domainsAuthCommon, 'createFirstAdminUser')
      .withArgs(AUTH_TYPE.EMAIL, {
        email,
        password,
      } as domainsAdminUser.AdminUserCreatePayload)
      .resolves({
        id: '1',
        email,
        password: 'hashedPassword',
        salt: 'salt',
        roleIds: ['admin'],
      } as domainsAdminUser.AdminUserWithCredential);

    sandbox
      .stub(helper, 'verifyPassword')
      .withArgs(password, 'hashedPassword', 'salt')
      .returns(true);

    sandbox.stub(domainsAuthJwt, 'signJwt').withArgs('1', req).resolves(token);

    const result = await signinEmail(req, email, password);
    assert.strictEqual(result, token);
  });

  it('should throw an error if password is incorrect', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';

    sandbox
      .stub(domainsAdminUser, 'findOneByEmail')
      .withArgs(email)
      .resolves({
        id: '1',
        email,
        password: 'hashedPassword',
        salt: 'salt',
        roleIds: ['admin'],
      } as domainsAdminUser.AdminUserWithCredential);

    sandbox
      .stub(helper, 'verifyPassword')
      .withArgs(password, 'hashedPassword', 'salt')
      .returns(false);

    await assert.rejects(signinEmail(req, email, password), signinFailed());
  });

  it('should throw an error if admin user creation fails', async () => {
    const email = 'newuser@example.com';
    const password = 'password';

    sandbox
      .stub(domainsAdminUser, 'findOneByEmail')
      .withArgs(email)
      .resolves(null);

    sandbox
      .stub(domainsAuthCommon, 'createFirstAdminUser')
      .withArgs(AUTH_TYPE.EMAIL, {
        email,
        password,
      } as domainsAdminUser.AdminUserCreatePayload)
      .resolves(null);

    await assert.rejects(signinEmail(req, email, password), signinFailed());
  });
});
