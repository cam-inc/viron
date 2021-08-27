import { list as userList } from './users';
import { list as purchaseList } from './purchases';
import { list as articleList } from './articles';
import {
  getArticleRepository,
  getPurchaseRepository,
  getUserRepository,
} from '../repositories';

const genAmount = (): number => Math.floor(Math.random() * (10 + 1 - 1)) + 1;

export const load = async (): Promise<void> => {
  const articleRepository = getArticleRepository();
  const purchaseRepository = getPurchaseRepository();
  const userRepository = getUserRepository();
  await Promise.all(
    [
      userList.map(async (obj) => {
        const doc = await userRepository.findOne({ name: obj.name });
        if (doc) {
          return;
        }
        const user = await userRepository.createOne(obj);
        return await Promise.all(
          purchaseList.map((p) =>
            purchaseRepository.createOne(
              Object.assign({ amount: genAmount(), userId: user.id }, p)
            )
          )
        );
      }) as Promise<unknown>[],
      articleList.map(async (obj) => {
        const doc = await articleRepository.findOne({ title: obj.title });
        if (doc) {
          return;
        }
        return await articleRepository.createOne(obj);
      }) as Promise<unknown>[],
    ].flat()
  );
};
