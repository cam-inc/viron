import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
} from 'sequelize';
import { ItemCreateAttributes, ItemWithoutDetail } from '../../../domains/item';

export const name = 'items';

const schemaDefinition: ModelAttributes<ItemModel, ItemWithoutDetail> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

export class ItemModel extends Model<ItemWithoutDetail, ItemCreateAttributes> {
  id!: number;
  name!: string;
  nickName!: string;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type ItemModelStatic = ModelStatic<ItemModel>;

export const createModel = (s: Sequelize): ItemModelStatic => {
  return s.define(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [],
  });
};
