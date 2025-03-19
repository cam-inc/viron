import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
} from 'sequelize';
import {
  AdminUserSsoToken,
  AdminUserSsoTokenCreateAttributes,
} from '../../../domains/adminuserssotoken';

export const name = 'adminuserssotokens';

const schemaDefinition: ModelAttributes<
  AdminUserSsoTokenModel,
  AdminUserSsoToken
> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    get() {
      return `${this.getDataValue('id')}`;
    },
  },
  authType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  idToken: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tokenType: {
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

export class AdminUserSsoTokenModel extends Model<
  AdminUserSsoToken,
  AdminUserSsoTokenCreateAttributes
> {
  id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type AdminUserSsoTokenModelStatic = ModelStatic<AdminUserSsoTokenModel>;

export const createModel = (
  s: Sequelize
): ModelStatic<AdminUserSsoTokenModel> => {
  return s.define<AdminUserSsoTokenModel>(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [{ unique: true, fields: ['email'] }],
  });
};
