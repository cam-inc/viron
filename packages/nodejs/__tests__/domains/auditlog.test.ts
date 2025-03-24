import assert from 'assert';
import sinon from 'sinon';
import {
  AuditLog,
  AuditLogCreateAttributes,
  AuditLogUpdateAttributes,
  createOne,
  list,
  maskRequestBody,
  createOneWithMasking,
  isSkip,
} from '../../src/domains/auditlog';
import { dereference, VironOpenAPIObject } from '../../src/domains/oas';
import { Repository, repositoryContainer } from '../../src/repositories';
import { OAS_X_SKIP_AUDITLOG } from '../../src/constants';

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
    it('using resolved oas no body', async () => {
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
      const result = await maskRequestBody('/users', 'post', _oas);
      assert.strictEqual(result, '{}');
    });

    it('using resolved oas no operation', async () => {
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
      const result = await maskRequestBody('/dummy', 'post', _oas, {
        name: 'test',
        password: '**************************',
      });
      assert.strictEqual(
        result,
        JSON.stringify({
          name: 'test',
          password: '**************************',
        })
      );
    });

    it('using resolved oas no schema', async () => {
      const pathItemUsers = {
        post: {
          operationId: 'createUser',
          requestBody: {
            required: true,
            content: {
              'application/json': {},
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
        password: '**************************',
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

  describe('createOneWithMasking', () => {
    it('should create an audit log with masking', async () => {
      const uri = '/users';
      const method = 'POST';
      const oas: VironOpenAPIObject = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {
          '/users': {
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
            },
          },
        },
      };
      const payload = {
        requestMethod: method,
        requestUri: uri,
        sourceIp: '127.0.0.1',
        userId: 'xxx',
        statusCode: 201,
      };
      const requestBody = {
        name: 'test',
        password: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      };
      sandbox
        .stub(repository, 'createOne')
        .withArgs(
          sandbox.match({
            ...payload,
            requestBody: JSON.stringify({
              name: 'test',
              password: '**************************',
            }),
          })
        )
        .resolves({
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...payload,
          requestBody: JSON.stringify({
            name: 'test',
            password: '**************************',
          }),
        });
      const result = await createOneWithMasking(
        uri,
        method,
        oas,
        payload,
        requestBody
      );
      assert.strictEqual(result?.id, '1');
    });

    it('should skip creating an audit log if skip condition is met', async () => {
      const uri = '/health';
      const method = 'GET';
      const oas: VironOpenAPIObject = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {
          '/health': {
            get: {
              operationId: 'checkHealth',
              [OAS_X_SKIP_AUDITLOG]: true,
            },
          },
        },
      };
      const payload = {
        requestMethod: method,
        requestUri: uri,
        sourceIp: '127.0.0.1',
        userId: 'xxx',
        statusCode: 200,
      };
      const result = await createOneWithMasking(uri, method, oas, payload);
      assert.strictEqual(result, null);
    });
  });

  describe('isSkip', () => {
    it('should return true if skip condition is met', () => {
      const uri = '/health';
      const method = 'GET';
      const oas: VironOpenAPIObject = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {
          '/health': {
            get: {
              operationId: 'checkHealth',
              [OAS_X_SKIP_AUDITLOG]: true,
            },
          },
        },
      };
      const result = isSkip(uri, method, oas);
      assert.strictEqual(result, true);
    });

    it('should return false if skip condition is not met', () => {
      const uri = '/users';
      const method = 'POST';
      const oas: VironOpenAPIObject = {
        openapi: '3.0.2',
        info: {
          title: 'test',
          version: '0.0.1',
        },
        paths: {
          '/users': {
            post: {
              operationId: 'createUser',
            },
          },
        },
      };
      const result = isSkip(uri, method, oas);
      assert.strictEqual(result, false);
    });
  });
});
