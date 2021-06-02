import { Model, Sequelize, DataTypes, ModelCtor } from 'sequelize';
import {
  AdminUser,
  AdminUserCreateAttributes,
} from '../../../domains/adminuser';

export const name = 'adminusers';

export class AdminUserModel extends Model<
  AdminUser,
  AdminUserCreateAttributes
> {
  id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type AdminUserModelCtor = ModelCtor<AdminUserModel>;

export const createModel = (s: Sequelize): ModelCtor<AdminUserModel> => {
  const Model = s.define<AdminUserModel>(
    name,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salt: {
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
      indexes: [{ unique: true, fields: ['email'] }],
    }
  );

  return Model;
};
