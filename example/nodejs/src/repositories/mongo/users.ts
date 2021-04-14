import { User, UserCreationAttributes } from '../../domains/user';
import { UserModel } from '../../stores/definitions/mongo/users';
import { ctx } from '../../context';

const getModel = (): UserModel =>
  ctx.stores.main.models.users.Model as UserModel;

export const findById = async (id: string): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const create = async (user: UserCreationAttributes): Promise<User> => {
  const model = getModel();
  const doc = await model.create(user);
  return doc.toJSON();
};
