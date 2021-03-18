import { Model, Sequelize, DataTypes, ModelCtor } from 'sequelize';

export const name = 'users';

export interface User {
  id?: number;
  name: string | null;
  nickName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes {
  name: string | null;
  nickName: string | null;
}

export class UserModel extends Model<User, UserCreationAttributes> {
  id!: number;
  name!: string | null;
  nickName!: string | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type UserModelCtor = ModelCtor<UserModel>;

export const createModel = (s: Sequelize): UserModelCtor => {
  const Model = s.define<UserModel>(
    name,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nickName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      deletedAt: false,
      charset: 'utf8',
      indexes: [],
    }
  );

  return Model;
};
