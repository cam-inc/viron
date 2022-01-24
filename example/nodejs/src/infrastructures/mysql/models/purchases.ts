import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
} from 'sequelize';
import { Purchase, PurchaseCreateAttributes } from '../../../domains/purchase';

export const name = 'purchases';

const schemaDefinition: ModelAttributes<PurchaseModel, Purchase> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.INTEGER.UNSIGNED,
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

export class PurchaseModel extends Model<Purchase, PurchaseCreateAttributes> {
  id!: number;
  userId!: string;
  itemId!: string;
  amount!: number;
  unitPrice!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type PurchaseModelStatic = ModelStatic<PurchaseModel>;

export const createModel = (s: Sequelize): PurchaseModelStatic => {
  return s.define(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [],
  });
};
