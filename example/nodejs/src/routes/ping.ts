import { Response, Request } from 'express';
import { ctx } from '../context';

/**
 * Ping
 * @route GET /ping
 */
export const getPing = (_req: Request, res: Response): void => {
  // const now = new Date();
  // const name = `fkei_${now}`;
  // ctx.stores.main.models.users.Model.create({
  //   name,
  //   nickName: `nickname_${name}`,
  // }).then((doc) => {
  //   console.log(`create ${doc}`);
  //   ctx.stores.main.models.users.Model.findById(doc._id)
  //     .exec()
  //     .then((fdoc) => {
  //       res.json(fdoc?.toJSON());
  //     });
  // });
  res.send('pong');
};
