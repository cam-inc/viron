import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
} from 'sequelize';
import { ItemDetail } from '../../../domains/item';

export const name = 'itemdetails';

type ItemDetailWithItemId = ItemDetail | { itemId: string };

const schemaDefinition: ModelAttributes<ItemDetailModel, ItemDetailWithItemId> =
  {
    itemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productCode: {
      type: DataTypes.STRING,
    },
    manufacturer: {
      type: DataTypes.STRING,
    },
    manufacturingCost: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    downloadUrl: {
      type: DataTypes.STRING,
    },
  };

export class ItemDetailModel extends Model<ItemDetailWithItemId, ItemDetail> {
  itemId!: string;
  type!: string;
  productCode!: string;
  manufacturer!: string;
  manufacturingCost!: number;
  downloadUrl!: string;
}

export type ItemDetailModelStatic = ModelStatic<ItemDetailModel>;

export const createModel = (s: Sequelize): ItemDetailModelStatic => {
  return s.define(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [],
  });
};
