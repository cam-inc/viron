import { Response, Request } from 'express';
import { ctx } from '../context';

/**
 * Ping
 * @route GET /ping
 */
export const getPing = async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const name = `fkei_${now}`;
  const doc1 = await ctx.stores.main.models.users.Model.create({
    name,
    nickName: `nickname_${name}`,
  });
  console.log(`create ${doc1}`);
  const fdoc1 = await ctx.stores.main.models.users.Model.findById(doc1._id);
  console.log(fdoc1?.toJSON());

  const doc2 = await ctx.stores.main.models.auditLog.Model.create({
    requestMethod: 'GET',
    requestUri: `/ping?now=${now}`,
    sourceIp: '127.0.0.1',
    userId: 'fkei',
    requestBody: 'pong',
    statusCode: 200,
  });
  console.log(`create ${doc2}`);
  const fdoc2 = await ctx.stores.main.models.auditLog.Model.findById(doc2._id);
  console.log(fdoc2?.toJSON());

  res.send('pong');
};
