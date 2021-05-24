import assert from 'assert';
import { getPagerResults, paging } from '../../src/helpers/pager';

describe('helpers/pager', () => {
  describe('getPagerResults', () => {
    it('Get max page number and current pager number.', () => {
      const { maxPage, currentPage } = getPagerResults(1024, 100, 2);
      assert.strictEqual(maxPage, 11);
      assert.strictEqual(currentPage, 2);
    });
  });

  describe('paging', () => {
    it('Get pagenated list and pager info.', () => {
      const ary = [
        'foo',
        'bar',
        'baz',
        'qux',
        'quux',
        'corge',
        'grault',
        'garply',
        'waldo',
      ];
      const { list, maxPage, currentPage } = paging(ary, 4, 2);
      assert.deepStrictEqual(list, ['quux', 'corge', 'grault', 'garply']);
      assert.strictEqual(maxPage, 3);
      assert.strictEqual(currentPage, 2);
    });
  });
});
