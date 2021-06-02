import { repositoryContainer } from '@viron/lib';
import { getUserRepository } from '../repositories';
import { RouteContext } from '../application';

// Ping
export const getPing = async (context: RouteContext): Promise<void> => {
  const now = new Date();
  const name = `fkei_${now}`;
  const doc1 = await getUserRepository().createOne({
    name,
    nickName: `nickname_${name}`,
  });
  console.log('create', doc1);
  const fdoc1 = await getUserRepository().findOneById(doc1.id);
  console.log(fdoc1);

  const doc2 = await repositoryContainer.getAuditLogRepository().createOne({
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
    .findOneById(doc2.id);
  console.log(fdoc2);

  context.res.setBody('pong');
};
