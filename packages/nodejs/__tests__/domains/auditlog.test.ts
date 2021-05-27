import assert from 'assert';
import sinon from 'sinon';
import {
  AuditLog,
  AuditLogCreateAttributes,
  AuditLogUpdateAttributes,
  createOne,
  list,
} from '../../src/domains/auditlog';
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
});
