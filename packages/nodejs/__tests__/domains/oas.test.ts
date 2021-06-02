import assert from 'assert';
import path from 'path';
import { get, getPath, loadOas, loadResolvedOas } from '../../src/domains/oas';

describe('domains/oas', () => {
  describe('get', () => {
    it('Get simple.', async () => {
      const oas = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {},
      };
      const result = await get(oas);
      assert.deepStrictEqual(result, oas);
    });
  });

  describe('getPath', () => {
    it('Get yaml file path.', () => {
      const result = getPath('oas');
      assert.strictEqual(
        result,
        path.resolve(__dirname, '../../src/openapi/oas.yaml')
      );
    });
  });

  describe('loadOas', () => {
    it('Get openapi object', async () => {
      const oasPath = path.resolve(__dirname, '../fixtures/test_oas.yaml');
      const result = await loadOas(oasPath);
      assert.strictEqual(result.openapi, '3.0.2');
      assert.strictEqual(result.info.title, '@viron/lib test');
      assert.strictEqual(
        result.paths['/'].get.parameters[0].$ref,
        '#/components/parameters/TestQueryParam'
      );
    });
  });

  describe('loadResolvedOas', () => {
    it('Get $ref resolved openapi object', async () => {
      const oasPath = path.resolve(__dirname, '../fixtures/test_oas.yaml');
      const result = await loadResolvedOas(oasPath);
      assert.strictEqual(result.openapi, '3.0.2');
      assert.strictEqual(result.info.title, '@viron/lib test');
      // $refが解決されてパラメータオブジェクトになっている
      assert.deepStrictEqual(
        result.paths['/'].get.parameters[0],
        result.components?.parameters?.TestQueryParam
      );
    });
  });
});
