import assert from 'assert';
import path from 'path';
import sinon from 'sinon';
import copy from 'fast-copy';
import {
  API_METHOD,
  PERMISSION,
  X_PAGE_CONTENT_TYPE,
} from '../../src/constants';
import {
  clearCache,
  get,
  getPath,
  getResourceId,
  loadOas,
  loadResolvedOas,
  VironOpenAPIObject,
} from '../../src/domains/oas';
import * as domainsAdminrole from '../../src/domains/adminrole';

describe('domains/oas', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
    clearCache();
  });

  describe('get', () => {
    it('Get simple.', async () => {
      const oas = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
          'x-pages': [],
        },
        paths: {},
      };
      const result = await get(oas);
      assert.deepStrictEqual(result, oas);
    });

    it('Get an oas that filtered by roleIds', async () => {
      const roleIds = ['editor'];
      const pageUsers = {
        id: 'users',
        group: 'test',
        title: 'User List',
        description: 'user list for test.',
        contents: [
          {
            title: 'ユーザー',
            resourceId: 'user',
            operationId: 'listUsers',
            type: X_PAGE_CONTENT_TYPE.TABLE,
          },
        ],
      };
      const pageBlogs = {
        id: 'blogs',
        group: 'test',
        title: 'Blog List',
        description: 'blog list for test.',
        contents: [
          {
            title: 'ブログ',
            resourceId: 'blog',
            operationId: 'listBlogs',
            type: X_PAGE_CONTENT_TYPE.TABLE,
          },
        ],
      };
      const pathItemUsers = {
        get: {
          operationId: 'listUsers',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: {},
                  },
                },
              },
            },
          },
        },
      };
      const pathItemBlogs = {
        get: {
          operationId: 'listBlogs',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: {},
                  },
                },
              },
            },
          },
        },
      };

      const oas = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
          'x-pages': [pageUsers, pageBlogs],
        },
        paths: {
          '/users': pathItemUsers,
          '/blogs': pathItemBlogs,
        },
      };

      sandbox
        .stub(domainsAdminrole, 'hasPermissionByResourceId')
        .withArgs(
          'editor',
          'user',
          sinon.match([
            PERMISSION.READ,
            PERMISSION.WRITE,
            PERMISSION.DELETE,
            PERMISSION.ALL,
          ])
        )
        .resolves(false)
        .withArgs(
          'editor',
          'blog',
          sinon.match([
            PERMISSION.READ,
            PERMISSION.WRITE,
            PERMISSION.DELETE,
            PERMISSION.ALL,
          ])
        )
        .resolves(true);
      sandbox
        .stub(domainsAdminrole, 'hasPermission')
        .withArgs('editor', '/users', 'get', oas)
        .resolves(false)
        .withArgs('editor', '/blogs', 'get', oas)
        .resolves(true);

      const expects = Object.assign(copy(oas), {
        info: {
          title: 'test',
          version: '0.0.1',
          'x-pages': [pageBlogs],
        },
        paths: {
          '/blogs': pathItemBlogs,
        },
      });
      const result = await get(oas, {}, roleIds);
      assert.deepStrictEqual(result, expects);
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
                title: 'ブログ',
                operationId: 'listBlog',
                resourceId: 'blog',
                type: 'table',
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
                title: 'ユーザーブログ',
                operationId: 'listUserBlog',
                resourceId: 'userblog',
                type: 'table',
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
