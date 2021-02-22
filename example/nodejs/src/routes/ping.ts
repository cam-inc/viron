import { Response, Request } from 'express';
import { ctx } from '../context';

/**
 * Ping
 * @route GET /ping
 */
export const getPing = (_req: Request, res: Response): void => {
  const now = new Date();
  const name = `fkei_${now}`;
  ctx.stores.main.models.users.Model.create({
    name,
    nickName: `nickname_${name}`,
  }).then((doc) => {
    console.log(`create ${doc}`);
    ctx.stores.main.models.users.Model.findById(doc._id)
      .exec()
      .then((fdoc) => {
        res.json(fdoc?.toJSON());
      });
  });

  ctx.stores.main.models.auditLog.Model.create({
    requestMethod: 'GET',
    requestUri: `/ping?now=${now}`,
    sourceIp: '127.0.0.1',
    userId: 'fkei',
    requestBody: 'pong',
    statusCode: 200,
  }).then((doc) => {
    console.log(`create ${doc}`);
    ctx.stores.main.models.auditLog.Model.findById(doc._id)
      .exec()
      .then((fdoc) => {
        res.json(fdoc?.toJSON());
      });
  });
  res.send('pong');
};
