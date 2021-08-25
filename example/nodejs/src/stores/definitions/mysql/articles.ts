import {
  Model,
  Sequelize,
  DataTypes,
  ModelCtor,
  ModelAttributes,
} from 'sequelize';
import { Article, ArticleCreateAttributes } from '../../../domains/article';

export const name = 'articles';

const schemaDefinition: ModelAttributes<ArticleModel, Article> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.ARRAY(DataTypes.JSON),
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

export class ArticleModel extends Model<Article, ArticleCreateAttributes> {
  id!: number;
  title!: string;
  body!: string;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export type ArticleModelCtor = ModelCtor<ArticleModel>;

export const createModel = (s: Sequelize): ArticleModelCtor => {
  return s.define(name, schemaDefinition, {
    timestamps: true,
    deletedAt: false,
    charset: 'utf8',
    indexes: [],
  });
};
