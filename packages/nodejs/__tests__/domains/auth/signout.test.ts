import assert from 'assert';
import sinon from 'sinon';
import {
  isSignedout,
  RevokedToken,
  RevokedTokenCreateAttributes,
  RevokedTokenUpdateAttributes,
  signout,
} from '../../../src/domains/auth';
import { Repository, repositoryContainer } from '../../../src/repositories';

describe('domains/auth/signout', () => {
  const sandbox = sinon.createSandbox();

  let repository: Repository<
    RevokedToken,
    RevokedTokenCreateAttributes,
    RevokedTokenUpdateAttributes
  >;

  beforeAll(() => {
    repository = repositoryContainer.getRevokedTokenRepository();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('signout', () => {
    it('Succeed to signout.', async () => {
      const token = 'test';
      const result = await signout(token);
      assert.strictEqual(result, true);
    });

    it('Failed to signout when token is empty', async () => {
      const token = '';
      const result = await signout(token);
      assert.strictEqual(result, false);
    });
  });

  describe('isSignedout', () => {
    it('Return true when already signed out.', async () => {
      const token = 'test';

      sandbox
        .stub(repository, 'findOne')
        .withArgs({
          token,
        })
        .resolves({
          id: '1',
          token,
          revokedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const result = await isSignedout(token);
      assert.strictEqual(result, true);
    });

    it('Return false when token is empty.', async () => {
      const token = '';

      const result = await isSignedout(token);
      assert.strictEqual(result, false);
    });

    it('Return false when not signed out.', async () => {
      const token = 'test';

      sandbox
        .stub(repository, 'findOne')
        .withArgs({
          token,
        })
        .resolves(null);

      const result = await isSignedout(token);
      assert.strictEqual(result, false);
    });
  });
});
