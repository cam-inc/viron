import {
  Model,
  Sequelize,
  DataTypes,
  ModelCtor,
  ModelAttributes,
} from 'sequelize';
import {
  RevokedToken,
  RevokedTokenCreateAttributes,
} from '../../../domains/auth';

export const name = 'revokedtokens';

const schemaDefinition: ModelAttributes<RevokedTokenModel, RevokedToken> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  revokedAt: {
    type: DataTypes.DATE,
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

export class RevokedTokenModel extends Model<
  RevokedToken,
  RevokedTokenCreateAttributes
> {
  id!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type RevokedTokenModelCtor = ModelCtor<RevokedTokenModel>;

export const createModel = (s: Sequelize): ModelCtor<RevokedTokenModel> => {
  return s.define(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [],
  });
};
