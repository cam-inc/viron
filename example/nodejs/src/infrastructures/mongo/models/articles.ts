import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { Article } from '../../../domains/article';

export const name = 'articles';

const bodyItemSchema: SchemaDefinition = {
  linkArea: {
    type: Schema.Types.String,
  },
  textArea: {
    type: Schema.Types.String,
  },
  headingTextArea: new Schema({
    level: {
      type: Schema.Types.String,
    },
    text: {
      type: Schema.Types.String,
    },
  }),
  textButtonArea: new Schema({
    text: {
      type: Schema.Types.String,
    },
    link: {
      type: Schema.Types.String,
    },
  }),
  relatedArticleArea: new Schema({
    relatedArticles: [
      new Schema({
        text: {
          type: Schema.Types.String,
        },
        link: {
          type: Schema.Types.String,
        },
      }),
    ],
  }),
};

const schemaDefinition: SchemaDefinition = {
  title: {
    type: Schema.Types.String,
    required: true,
  },
  body: {
    type: [new Schema(bodyItemSchema)],
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
