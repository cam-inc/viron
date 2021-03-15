import { Response, Request } from 'express';
import { ctx } from '../context';
import { MysqlStore } from '../stores/mysql';
import { MongoStore } from '../stores/mongo';
import { modeMysql, modeMongo } from '../constant';
import { newNoSetEnvMode } from '../errors';

const mysqlPing = async (store: MysqlStore): Promise<void> => {
  const now = new Date();
  const name = `fkei_${now}`;
  const doc1 = await store.models.users.Model.create({
    name,
    nickName: `nickname_${name}`,
  });

  console.log('create', doc1.toJSON());
  const fdoc1 = await store.models.users.Model.findByPk(doc1.id);
  console.log('find', fdoc1?.toJSON());

  const doc2 = await store.models.auditLog.Model.create({
    requestMethod: 'GET',
    requestUri: `/ping?now=${now}`,
    sourceIp: '127.0.0.1',
    userId: 'fkei',
    requestBody: 'pong',
    statusCode: 200,
  });
  console.log('create', doc2.toJSON());
  const fdoc2 = await store.models.auditLog.Model.findByPk(doc2.id);
  console.log('find', fdoc2?.toJSON());
};

const mongoPing = async (store: MongoStore): Promise<void> => {
  const now = new Date();
  const name = `fkei_${now}`;
  const doc1 = await store.models.users.Model.create({
    name,
    nickName: `nickname_${name}`,
  });
  console.log(`create ${doc1}`);
  const fdoc1 = await store.models.users.Model.findById(doc1._id);
  console.log(fdoc1?.toJSON());

  const doc2 = await store.models.auditLog.Model.create({
    requestMethod: 'GET',
    requestUri: `/ping?now=${now}`,
    sourceIp: '127.0.0.1',
    userId: 'fkei',
    requestBody: 'pong',
    statusCode: 200,
  });
  console.log(`create ${doc2}`);
  const fdoc2 = await store.models.auditLog.Model.findById(doc2._id);
  console.log(fdoc2?.toJSON());
};

/**
 * Ping
 * @route GET /ping
 */
export const getPing = async (_req: Request, res: Response): Promise<void> => {
  switch (ctx.mode) {
    case modeMongo:
      mongoPing(ctx.stores.main as MongoStore);
      break;
    case modeMysql:
      mysqlPing(ctx.stores.main as MysqlStore);
      break;
    default:
      throw newNoSetEnvMode();
  }
  res.send('pong');
};
