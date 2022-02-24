import { mongo } from '@viron/lib';
import { Article } from '../../../domains/article';
type Document = mongo.mongoose.Document;
type Model<T> = mongo.mongoose.Model<T>;
type SchemaDefinition = mongo.mongoose.SchemaDefinition;
const Schema = mongo.mongoose.Schema;

export const name = 'articles';

const bodyItemSchema: SchemaDefinition = {
  linkArea: {
    type: Schema.Types.String,
  },
  textArea: {
    type: Schema.Types.String,
  },
  headingTextArea: new Schema(
    {
      level: {
        type: Schema.Types.String,
      },
      text: {
        type: Schema.Types.String,
      },
    },
    { _id: false }
  ),
  textButtonArea: new Schema(
    {
      text: {
        type: Schema.Types.String,
      },
      link: {
        type: Schema.Types.String,
      },
    },
    { _id: false }
  ),
  relatedArticleArea: new Schema(
    {
      relatedArticles: [
        new Schema(
          {
            text: {
              type: Schema.Types.String,
            },
            link: {
              type: Schema.Types.String,
            },
          },
          { _id: false }
        ),
      ],
    },
    { _id: false }
  ),
};

const schemaDefinition: SchemaDefinition = {
  title: {
    type: Schema.Types.String,
    required: true,
  },
  body: {
    type: [new Schema(bodyItemSchema, { _id: false })],
    required: true,
  },
  createdAt: {
    type: Schema.Types.Number,
    get: (createdAt: number) => new Date(createdAt * 1000),
  },
  updatedAt: {
    type: Schema.Types.Number,
    get: (updatedAt: number) => new Date(updatedAt * 1000),
  },
};

export interface ArticleDocument extends Article, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type ArticleModel = Model<ArticleDocument>;

export const schema = new Schema<ArticleDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
