import {
  Model,
  Sequelize,
  DataTypes,
  ModelCtor,
  ModelAttributes,
} from 'sequelize';
import { Media, MediaCreateAttributes } from '../../../domains/media';

export const name = 'medias';

const schemaDefinition: ModelAttributes<MediaModel, Media> = {
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
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentType: {
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

export class MediaModel extends Model<Media, MediaCreateAttributes> {
  id!: number;
  name!: string;
  filePath!: string;
  contentType!: string;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type MediaModelCtor = ModelCtor<MediaModel>;

export const createModel = (s: Sequelize): MediaModelCtor => {
  return s.define(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [],
  });
};
