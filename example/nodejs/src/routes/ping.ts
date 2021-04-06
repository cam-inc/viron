import { Response, Request } from 'express';
import { Context as RequestContext } from 'openapi-backend';
import { repositories } from '@viron/lib';
import { getUserRepository } from '../repositories';

const repositoryContainer = repositories.container;

/**
 * Ping
 * @route GET /ping
 */
export const getPing = async (
  _context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  const now = new Date();
  const name = `fkei_${now}`;
  const doc1 = await getUserRepository().create({
    name,
    nickName: `nickname_${name}`,
  });
  console.log('create', doc1);
  const fdoc1 = await getUserRepository().findById(doc1.id);
  console.log(fdoc1);

  const doc2 = await repositoryContainer.getAuditLogRepository().create({
    requestMethod: 'GET',
    requestUri: `/ping?now=${now}`,
    sourceIp: '127.0.0.1',
    userId: 'fkei',
    requestBody: 'pong',
    statusCode: 200,
  });
  console.log('create', doc2);
  const fdoc2 = await repositoryContainer
    .getAuditLogRepository()
    .findById(doc2.id);
  console.log(fdoc2);

  res.send('pong');
};
