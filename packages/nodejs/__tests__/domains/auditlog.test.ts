import assert from 'assert';
import sinon from 'sinon';
import {
  AuditLog,
  AuditLogCreateAttributes,
  AuditLogUpdateAttributes,
  createOne,
  list,
  maskRequestBody,
} from '../../src/domains/auditlog';
import { dereference, VironOpenAPIObject } from '../../src/domains/oas';
import { Repository, repositoryContainer } from '../../src/repositories';

describe('domains/auditlog', () => {
  const sandbox = sinon.createSandbox();

  let repository: Repository<
    AuditLog,
    AuditLogCreateAttributes,
    AuditLogUpdateAttributes
  >;

  beforeAll(() => {
    repository = repositoryContainer.getAuditLogRepository();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('list', () => {
    it('Get list with pager.', async () => {
      sandbox.stub(repository, 'findWithPager').resolves({
        list: [
          {
            id: '1',
            requestMethod: 'GET',
            requestUri: '/foo',
            sourceIp: '127.0.0.1',
            userId: 'yyy',
            requestBody: '{}',
            statusCode: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        maxPage: 1,
        currentPage: 1,
      });
      const result = await list();
      assert.strictEqual(result.list.length, 1);
      assert.strictEqual(result.maxPage, 1);
      assert.strictEqual(result.currentPage, 1);
    });
  });

  describe('createOne', () => {
    it('Return created resource', async () => {
      const data: AuditLogCreateAttributes = {
        requestMethod: 'GET',
        requestUri: '/foo',
        sourceIp: '127.0.0.1',
        userId: 'xxx',
        requestBody: '{}',
        statusCode: 201,
      };
      sandbox
        .stub(repository, 'createOne')
        .withArgs(sandbox.match(data))
        .resolves({
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        });

      const result = await createOne(data);
      assert.strictEqual(result.id, '1');
    });
  });

  describe('maskRequestBody', () => {
    it('using resolved oas', async () => {
      const pathItemUsers = {
        post: {
          operationId: 'createUser',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                    },
                  },
                  required: ['name', 'password'],
                },
              },
            },
          },
          responses: {
            '201': {
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

      const oas: VironOpenAPIObject = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {
          '/users': pathItemUsers,
        },
      };

      const _oas = await dereference(oas);
      const result = await maskRequestBody('/users', 'post', _oas, {
        name: 'test',
        password: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      });
      assert.strictEqual(
        result,
        JSON.stringify({
          name: 'test',
          password: '**************************',
        })
      );
    });

    it('using $ref', async () => {
      const pathItemUsers = {
        post: {
          operationId: 'createUser',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserCreatePayload',
                },
              },
            },
          },
          responses: {
            '201': {
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

      const oas: VironOpenAPIObject = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {
          '/users': pathItemUsers,
        },
        components: {
          schemas: {
            UserCreatePayload: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                password: {
                  type: 'string',
                  format: 'password',
                },
                users: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      secret: {
                        type: 'string',
                        format: 'password',
                      },
                    },
                  },
                },
              },
              required: ['name', 'password'],
            },
          },
        },
      };

      const _oas = await dereference(oas);
      const result = await maskRequestBody('/users', 'post', _oas, {
        name: 'test',
        password: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
        users: [
          {
            secret: 'yyyy',
          },
          {
            secret: 'zzzzzzzz',
          },
        ],
      });
      assert.strictEqual(
        result,
        JSON.stringify({
          name: 'test',
          password: '**************************',
          users: [
            {
              secret: '****',
            },
            {
              secret: '********',
            },
          ],
        })
      );
    });
  });
});
