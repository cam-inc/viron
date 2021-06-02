import assert from 'assert';
import { genPasswordHash, verifyPassword } from '../../src/helpers/password';

describe('helpers/password', () => {
  describe('genPasswordHash', () => {
    it('Generate hashed password and salt string.', () => {
      const { password: password1, salt } = genPasswordHash('foo');
      assert(password1);
      assert(salt);
      const { password: password2 } = genPasswordHash('foo', salt);
      assert.strictEqual(password1, password2);
    });
  });

  describe('verifyPassword', () => {
    it('Return true, when verified password.', () => {
      const { password: hashedPassword, salt } = genPasswordHash('foo');
      assert.strictEqual(verifyPassword('foo', hashedPassword, salt), true);
    });

    it('Return false, when invalid password.', () => {
      const { password: hashedPassword, salt } = genPasswordHash('foo');
      assert.strictEqual(verifyPassword('bar', hashedPassword, salt), false);
    });
  });
});
