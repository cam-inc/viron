import { ctx } from '../../context';
import { User, UserCreationAttributes } from '../../domains/models/user';
import { UserModelCtor } from '../../stores/definitions/mysql/users';

const getModel = (): UserModelCtor =>
  ctx.stores.main.models.users.Model as UserModelCtor;

export const findById = async (id: string): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as User) : null;
};

export const create = async (user: UserCreationAttributes): Promise<User> => {
  const model = getModel();
  const doc = await model.create(user);
  return doc.toJSON() as User;
};
