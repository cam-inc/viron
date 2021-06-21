import { list as userList } from './users';
import { list as purchaseList } from './purchases';
import { getPurchaseRepository, getUserRepository } from '../repositories';

const genAmount = (): number => Math.floor(Math.random() * (10 + 1 - 1)) + 1;

export const load = async (): Promise<void> => {
  const userRepository = getUserRepository();
  const purchaseRepository = getPurchaseRepository();
  await Promise.all(
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
    })
  );
};
