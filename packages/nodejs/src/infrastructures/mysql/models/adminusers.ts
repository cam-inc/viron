import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
} from 'sequelize';
import {
  AdminUser,
  AdminUserCreateAttributes,
} from '../../../domains/adminuser';

export const name = 'adminusers';

const schemaDefinition: ModelAttributes<AdminUserModel, AdminUser> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    get() {
      return `${this.getDataValue('id')}`;
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // for email
  password: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // for google
  googleOAuth2AccessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleOAuth2ExpiryDate: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  googleOAuth2IdToken: {
    type: DataTypes.STRING(2048),
    allowNull: true,
  },
  googleOAuth2RefreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleOAuth2TokenType: {
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
};

export class AdminUserModel extends Model<
  AdminUser,
  AdminUserCreateAttributes
> {
  id!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type AdminUserModelStatic = ModelStatic<AdminUserModel>;

export const createModel = (s: Sequelize): ModelStatic<AdminUserModel> => {
  return s.define<AdminUserModel>(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [{ unique: true, fields: ['email'] }],
  });
};
