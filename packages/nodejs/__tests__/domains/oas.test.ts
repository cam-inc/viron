import assert from 'assert';
import path from 'path';
import { API_METHOD } from '../../src/constants';
import {
  get,
  getPath,
  getResourceId,
  loadOas,
  loadResolvedOas,
  VironOpenAPIObject,
} from '../../src/domains/oas';

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

  describe('getResourceId', () => {
    const oas: VironOpenAPIObject = {
      openapi: '3.0.2',
      info: {
        title: 'test',
        version: '1.0.0',
        description: 'test',
        'x-pages': [
          {
            id: 'blog',
            group: 'blog',
            title: 'ブログ',
            description: 'ブログ',
            contents: [
              {
                getOperationId: 'listBlog',
                resourceId: 'blog',
                style: 'table',
              },
            ],
          },
          {
            id: 'userblog',
            group: 'blog',
            title: 'ユーザーブログ',
            description: 'ユーザーブログ',
            contents: [
              {
                getOperationId: 'listUserBlog',
                resourceId: 'userblog',
                style: 'table',
                actions: [
                  {
                    operationId: 'uploadUserBlog',
                  },
                ],
              },
            ],
          },
        ],
      },
      paths: {
        '/blogs': {
          [API_METHOD.GET]: {
            operationId: 'listBlog',
          },
          [API_METHOD.POST]: {
            operationId: 'createBlog',
          },
        },
        '/users/{userId}/blogs': {
          [API_METHOD.GET]: {
            operationId: 'listUserBlog',
          },
        },
        '/users/{userId}/blogs/{blogId}': {
          [API_METHOD.PUT]: {
            operationId: 'updateUserBlog',
          },
        },
        '/uploads/users/{userId}/blogs': {
          [API_METHOD.POST]: {
            operationId: 'uploadUserBlog',
          },
        },
      },
    };

    it('Hit the passed uri and method.', () => {
      const result = getResourceId('/blogs', API_METHOD.GET, oas);
      assert.strictEqual(result, 'blog');
    });

    it('Hit parent uri.', () => {
      const result = getResourceId('/users/xxx/blogs/1', API_METHOD.PUT, oas);
      assert.strictEqual(result, 'userblog');
    });

    it('Hit actions uri.', () => {
      const result = getResourceId(
        '/uploads/users/yyy/blogs',
        API_METHOD.POST,
        oas
      );
      assert.strictEqual(result, 'userblog');
    });

    it('Return null when not found.', () => {
      const result = getResourceId('/users', API_METHOD.POST, oas);
      assert.strictEqual(result, null);
    });
  });
});
