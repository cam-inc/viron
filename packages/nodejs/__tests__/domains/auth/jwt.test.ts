import assert from 'assert';
import sinon from 'sinon';
import { decode } from 'jsonwebtoken';
import * as domainsAuthSignout from '../../../src/domains/auth/signout';
import { initJwt, signJwt, verifyJwt } from '../../../src/domains/auth';

describe('domains/auth/jwt', () => {
  const sandbox = sinon.createSandbox();

  const config = {
    secret: 'test',
    provider: 'viron',
    expirationSec: 60,
  };

  afterEach(() => {
    sandbox.restore();
  });

  describe('initJwt', () => {
    it('Succeed to initialize and get an instance.', async () => {
      const result = initJwt(config);
      assert.strictEqual(result.secret, config.secret);
      assert.strictEqual(result.provider, config.provider);
      assert.strictEqual(result.expirationSec, config.expirationSec);
    });
  });

  describe('signJwt', () => {
    beforeEach(() => {
      initJwt(config, true);
    });

    it('Get a jwt.', async () => {
      const subject = 'test';
      const result = signJwt(subject);
      assert(result);
      const [type, token] = result.split(' ');
      assert.strictEqual(type, 'Bearer');
      const claims = decode(token);
      assert(claims);
      assert.strictEqual(claims.sub, subject);
    });
  });

  describe('verifyJwt', () => {
    beforeEach(() => {
      initJwt(config, true);
    });

    it('Get verified claims.', async () => {
      const subject = 'test';
      const token = signJwt(subject);

      sandbox
        .stub(domainsAuthSignout, 'isSignedout')
        .withArgs(token)
        .resolves(false);

      const result = await verifyJwt(token);
      assert(result);
      assert.strictEqual(result.sub, subject);
    });

    it('Return null when token is empty', async () => {
      const result = await verifyJwt();
      assert.strictEqual(result, null);
    });

    it('Return null when token is already signed out.', async () => {
      const subject = 'test';
      const token = signJwt(subject);

      sandbox
        .stub(domainsAuthSignout, 'isSignedout')
        .withArgs(token)
        .resolves(true);

      const result = await verifyJwt(token);
      assert.strictEqual(result, null);
    });
  });

  describe('custom provider', () => {
    beforeAll(() => {
      initJwt(
        {
          secret: 'test',
          provider: () => {
            return { issuer: 'custom-issuer', audience: ['custom-audience'] };
          },
          expirationSec: 60,
        },
        true
      );
    });
    it('Return custom issuer and audiences.', async () => {
      const subject = 'test';
      const token = signJwt(subject);

      sandbox
        .stub(domainsAuthSignout, 'isSignedout')
        .withArgs(token)
        .resolves(false);

      const result = await verifyJwt(token);
      assert(result);
      assert.strictEqual(result.iss, 'custom-issuer');
      assert.strictEqual(result.aud[0], 'custom-audience');
    });
  });
});
