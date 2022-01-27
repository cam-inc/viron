import { mongo } from '@viron/lib';
import { Item } from '../../../domains/item';
type Document = mongo.mongoose.Document;
type Model<T> = mongo.mongoose.Model<T>;
type SchemaDefinition = mongo.mongoose.SchemaDefinition;
const Schema = mongo.mongoose.Schema;

export const name = 'items';

const schemaDefinition: SchemaDefinition = {
  name: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  sellingPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  imageUrl: {
    type: Schema.Types.String,
    required: true,
  },
  detail: new Schema(
    {
      type: {
        type: Schema.Types.String,
        required: true,
      },
      // real goods
      productCode: {
        type: Schema.Types.String,
      },
      manufacturer: {
        type: Schema.Types.String,
      },
      manufacturingCost: {
        type: Schema.Types.Number,
      },
      // digital contents
      downloadUrl: {
        type: Schema.Types.String,
      },
    },
    { _id: false }
  ),
  createdAt: {
    type: Schema.Types.Number,
    get: (createdAt: number) => new Date(createdAt * 1000),
  },
  updatedAt: {
    type: Schema.Types.Number,
    get: (updatedAt: number) => new Date(updatedAt * 1000),
  },
};

export interface ItemDocument extends Item, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type ItemModel = Model<ItemDocument>;

export const schema = new Schema<ItemDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
