import assert from 'assert';
import { Enforcer } from 'casbin';
import { CasbinRule } from 'casbin-mongoose-adapter';
import {
  addRoleForUser,
  createOne,
  createViewer,
  hasPermission,
  hasPermissionByResourceId,
  listByOas,
  listPolicies,
  listResourcesByOas,
  listRoles,
  listUsers,
  removeRole,
  revokePermissionForRole,
  revokeRoleForUser,
  updatePermissionsForRole,
  updateRolesForUser,
} from '../../src/domains/adminrole';
import { VironOpenAPIObject } from '../../src/domains/oas';
import { repositoryContainer } from '../../src/repositories';
import {
  ADMIN_ROLE,
  API_METHOD,
  OAS_X_PAGES,
  PERMISSION,
} from '../../src/constants';
import { roleIdAlreadyExists } from '../../src/errors';

describe('domains/adminrole', () => {
  let casbin: Enforcer;
  let oas: VironOpenAPIObject;

  beforeAll(() => {
    casbin = repositoryContainer.getCasbin();
    oas = {
      openapi: '3.0.2',
      info: {
        title: 'test',
        version: '1.0.0',
        [OAS_X_PAGES]: [
          {
            id: 'blog',
            group: 'blog',
            title: 'ブログ',
            description: 'ブログ',
            contents: [
              {
                operationId: 'getBlog',
                resourceId: 'blog',
                type: 'table',
              },
            ],
          },
          {
            id: 'news',
            group: 'news',
            title: 'ニュース',
            description: 'ニュース',
            contents: [
              {
                operationId: 'getNews',
                resourceId: 'news',
                type: 'table',
              },
            ],
          },
        ],
      },
      paths: {},
      components: {
        schemas: {
          Xxxx: {
            type: 'object',
            properties: {
              hoge: {
                type: 'string',
              },
            },
            required: ['hoge'],
          },
        },
      },
    };
  });

  beforeEach(async () => {
    await Promise.all([
      casbin.addPolicy('editor', 'blog', PERMISSION.READ),
      casbin.addPolicy('editor', 'blog', PERMISSION.WRITE),
      casbin.addPolicy('reader', 'blog', PERMISSION.READ),
      casbin.addPolicy('reader', 'news', PERMISSION.READ),
      casbin.addPolicy('director', 'blog', PERMISSION.READ),
      casbin.addPolicy('director', 'blog', PERMISSION.WRITE),
      casbin.addPolicy('director', 'news', PERMISSION.READ),
      casbin.addPolicy('director', 'news', PERMISSION.WRITE),
    ]);
  });

  afterEach(async () => {
    await CasbinRule.deleteMany({});
    await casbin.loadPolicy();
  });

  describe('listRoles', () => {
    it('Get role list with userId.', async () => {
      const userId = '1';

      await casbin.addRoleForUser(userId, 'editor');
      await casbin.addRoleForUser(userId, 'reader');

      const result = await listRoles(userId);
      assert.deepStrictEqual(result, ['editor', 'reader']);
    });
  });

  describe('addRoleForUser', () => {
    it('Succeed to add role for user', async () => {
      const userId = '1';
      const result = await addRoleForUser(userId, 'editor');
      assert.strictEqual(result, true);
    });

    it('Failed to add role for user when already having.', async () => {
      const userId = '1';
      await casbin.addRoleForUser(userId, 'editor');
      const result = await addRoleForUser(userId, 'editor');
      assert.strictEqual(result, false);
    });
  });

  describe('revokeRoleForUser', () => {
    it('Succeed to revoke role for user', async () => {
      const userId = '1';
      await casbin.addRoleForUser(userId, 'editor');
      const result = await revokeRoleForUser(userId, 'editor');
      assert.strictEqual(result, true);
    });

    it('Failed to revoke role for user when not having.', async () => {
      const userId = '1';
      const result = await revokeRoleForUser(userId, 'editor');
      assert.strictEqual(result, false);
    });
  });

  describe('updateRolesForUser', () => {
    it('Succeed to update roles for user', async () => {
      const userId = '1';
      await casbin.addRoleForUser(userId, 'editor');

      await updateRolesForUser(userId, ['reader', 'director']);
      const actual = await listRoles(userId);
      assert.deepStrictEqual(actual, ['reader', 'director']);
    });
  });

  describe('listPolicies', () => {
    it('Get policy list filtered by roleId', async () => {
      const result = await listPolicies('editor');
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].roleId, 'editor');
      assert.strictEqual(result[0].resourceId, 'blog');
      assert.strictEqual(result[0].permission, PERMISSION.READ);
      assert.strictEqual(result[1].roleId, 'editor');
      assert.strictEqual(result[1].resourceId, 'blog');
      assert.strictEqual(result[1].permission, PERMISSION.WRITE);
    });

    it('Get all policies', async () => {
      const result = await listPolicies();
      assert.strictEqual(result.length, 8);
    });
  });

  describe('listUsers', () => {
    it('Get user list filtered by roleId', async () => {
      await Promise.all([
        casbin.addRoleForUser('1', 'editor'),
        casbin.addRoleForUser('2', 'editor'),
        casbin.addRoleForUser('3', 'reader'),
        casbin.addRoleForUser('4', 'director'),
        casbin.addRoleForUser('5', 'reader'),
        casbin.addRoleForUser('6', 'editor'),
      ]);
      const [editor, reader, director] = await Promise.all([
        listUsers('editor'),
        listUsers('reader'),
        listUsers('director'),
      ]);
      assert.deepStrictEqual(editor, ['1', '2', '6']);
      assert.deepStrictEqual(reader, ['3', '5']);
      assert.deepStrictEqual(director, ['4']);
    });
  });

  describe('revokePermissionForRole', () => {
    it('Succeed to revoke all permissions held by the resource.', async () => {
      const result = await revokePermissionForRole('director', 'blog');
      assert.strictEqual(result, true);

      const actual = await listPolicies('director');
      assert.strictEqual(actual.length, 2);
      assert.strictEqual(actual[0].resourceId, 'news');
      assert.strictEqual(actual[1].resourceId, 'news');
    });

    it('Succeed to revole one permission held by the resource.', async () => {
      const result = await revokePermissionForRole('director', 'blog', [
        'write',
      ]);
      assert.strictEqual(result, true);

      const actual = await listPolicies('director');
      assert.strictEqual(actual.length, 3);
      assert.strictEqual(actual[0].resourceId, 'blog');
      assert.strictEqual(actual[0].permission, PERMISSION.READ);
      assert.strictEqual(actual[1].resourceId, 'news');
      assert.strictEqual(actual[2].resourceId, 'news');
    });
  });

  describe('updatePermissionForRole', () => {
    it('Succeed to update permissions for role.', async () => {
      const result = await updatePermissionsForRole('editor', [
        {
          resourceId: 'news',
          permission: PERMISSION.READ,
        },
        {
          resourceId: 'news',
          permission: PERMISSION.WRITE,
        },
      ]);
      assert.strictEqual(result, true);

      const actual = await listPolicies('editor');
      assert.strictEqual(actual.length, 2);
      assert.strictEqual(actual[0].resourceId, 'news');
      assert.strictEqual(actual[0].permission, PERMISSION.READ);
      assert.strictEqual(actual[1].resourceId, 'news');
      assert.strictEqual(actual[1].permission, PERMISSION.WRITE);
    });
  });

  describe('removeRole', () => {
    it('Succeed to remove role.', async () => {
      const result = await removeRole('editor');
      assert.strictEqual(result, true);

      const actual = await listRoles('editor');
      assert.deepStrictEqual(actual, []);
    });
  });

  describe('hasPermissionByResourceId', () => {
    it('Return true when has pemission.', async () => {
      const result = await hasPermissionByResourceId('editor', 'blog', [
        PERMISSION.WRITE,
      ]);
      assert.strictEqual(result, true);
    });

    it('Return false when hasn`t pemission.', async () => {
      const result = await hasPermissionByResourceId('reader', 'blog', [
        PERMISSION.WRITE,
      ]);
      assert.strictEqual(result, false);
    });
  });

  describe('hasPermission', () => {
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
                operationId: 'listBlog',
                resourceId: 'blog',
                type: 'table',
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
      },
    };

    it('Return true when has pemission.', async () => {
      const userId = '1';
      await addRoleForUser(userId, 'editor');

      const result = await hasPermission(
        userId,
        '/blogs',
        API_METHOD.POST,
        oas
      );
      assert.strictEqual(result, true);
    });

    it('Return false when hasn`t pemission.', async () => {
      const userId = '1';
      await addRoleForUser(userId, 'reader');

      const result = await hasPermission(
        userId,
        '/blogs',
        API_METHOD.POST,
        oas
      );
      assert.strictEqual(result, false);
    });
  });

  describe('listResourcesByOas', () => {
    it('Get resource id list.', async () => {
      const result = listResourcesByOas(oas);
      assert.deepStrictEqual(result, ['blog', 'news']);
    });
  });

  describe('listByOas', () => {
    it('Get admin role list.', async () => {
      const result = await listByOas(oas);
      assert.strictEqual(result.maxPage, 1);
      assert.strictEqual(result.currentPage, 1);
      assert.strictEqual(result.list.length, 3);
      assert.strictEqual(result.list[0].id, 'editor');
      assert.strictEqual(result.list[0].permissions.length, 2);
      assert.strictEqual(result.list[0].permissions[0].resourceId, 'blog');
      assert.strictEqual(
        result.list[0].permissions[0].permission,
        PERMISSION.WRITE
      );
      assert.strictEqual(result.list[0].permissions[1].resourceId, 'news');
      assert.strictEqual(
        result.list[0].permissions[1].permission,
        PERMISSION.DENY
      );
      assert.strictEqual(result.list[1].id, 'reader');
      assert.strictEqual(result.list[1].permissions[0].resourceId, 'blog');
      assert.strictEqual(
        result.list[1].permissions[0].permission,
        PERMISSION.READ
      );
      assert.strictEqual(result.list[1].permissions[1].resourceId, 'news');
      assert.strictEqual(
        result.list[1].permissions[1].permission,
        PERMISSION.READ
      );
      assert.strictEqual(result.list[2].id, 'director');
      assert.strictEqual(result.list[2].permissions[0].resourceId, 'blog');
      assert.strictEqual(
        result.list[2].permissions[0].permission,
        PERMISSION.WRITE
      );
      assert.strictEqual(result.list[2].permissions[1].resourceId, 'news');
      assert.strictEqual(
        result.list[2].permissions[1].permission,
        PERMISSION.WRITE
      );
    });
  });

  describe('createOne', () => {
    it('Succeed to create an admin role.', async () => {
      const data = {
        id: 'manager',
        permissions: [
          {
            resourceId: 'blog',
            permission: PERMISSION.READ,
          },
          {
            resourceId: 'news',
            permission: PERMISSION.WRITE,
          },
        ],
      };
      const result = await createOne(data);
      assert(result);

      const actual = await listPolicies('manager');
      assert.strictEqual(actual.length, 2);
    });

    it('Faield to create when already exists.', async () => {
      const data = {
        id: 'editor',
        permissions: [
          {
            resourceId: 'blog',
            permission: PERMISSION.READ,
          },
          {
            resourceId: 'news',
            permission: PERMISSION.WRITE,
          },
        ],
      };

      const expects = roleIdAlreadyExists();
      await assert.rejects(createOne(data), {
        message: expects.message,
        name: expects.name,
        statusCode: expects.statusCode,
      });
    });
  });

  describe('updateOneById', () => {
    it('Succeed to update permissions for role.', async () => {
      const result = await updatePermissionsForRole('editor', [
        {
          resourceId: 'news',
          permission: PERMISSION.READ,
        },
        {
          resourceId: 'news',
          permission: PERMISSION.WRITE,
        },
      ]);
      assert.strictEqual(result, true);

      const actual = await listPolicies('editor');
      assert.strictEqual(actual.length, 2);
      assert.strictEqual(actual[0].resourceId, 'news');
      assert.strictEqual(actual[0].permission, PERMISSION.READ);
      assert.strictEqual(actual[1].resourceId, 'news');
      assert.strictEqual(actual[1].permission, PERMISSION.WRITE);
    });
  });

  describe('removeOneById', () => {
    it('Succeed to remove role.', async () => {
      const result = await removeRole('editor');
      assert.strictEqual(result, true);

      const actual = await listRoles('editor');
      assert.deepStrictEqual(actual, []);
    });
  });

  describe('createViewer', () => {
    it('Succeed to create viewer role.', async () => {
      const result = await createViewer(oas);
      assert.strictEqual(result, true);

      const actual = await listPolicies(ADMIN_ROLE.VIEWER);
      assert.strictEqual(actual.length, 2);
      assert.strictEqual(actual[0].resourceId, 'blog');
      assert.strictEqual(actual[0].permission, PERMISSION.READ);
      assert.strictEqual(actual[1].resourceId, 'news');
      assert.strictEqual(actual[1].permission, PERMISSION.READ);
    });

    it('Add read policy for added resouce', async () => {
      // 先に1件入れておく(newsがあとで追加されたように見せる)
      await casbin.addPolicy(ADMIN_ROLE.VIEWER, 'blog', PERMISSION.DENY);

      const result = await createViewer(oas);
      assert.strictEqual(result, true);
      const actual = await listPolicies(ADMIN_ROLE.VIEWER);
      assert.strictEqual(actual.length, 2);
      assert.strictEqual(actual[0].resourceId, 'blog');
      assert.strictEqual(actual[0].permission, PERMISSION.DENY);
      assert.strictEqual(actual[1].resourceId, 'news');
      assert.strictEqual(actual[1].permission, PERMISSION.READ);
    });

    it('Failed to create viewer role when already exists.', async () => {
      // 先に入れておく(追加されたリソースがないように見せる)
      await casbin.addPolicy(ADMIN_ROLE.VIEWER, 'blog', PERMISSION.DENY);
      await casbin.addPolicy(ADMIN_ROLE.VIEWER, 'news', PERMISSION.DENY);

      const result = await createViewer(oas);
      assert.strictEqual(result, false);
    });
  });
});
