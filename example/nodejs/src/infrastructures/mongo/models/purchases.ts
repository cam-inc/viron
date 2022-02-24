import { mongo } from '@viron/lib';
import { Purchase } from '../../../domains/purchase';
type Document = mongo.mongoose.Document;
type Model<T> = mongo.mongoose.Model<T>;
type SchemaDefinition = mongo.mongoose.SchemaDefinition;
const Schema = mongo.mongoose.Schema;

export const name = 'purchases';

const schemaDefinition: SchemaDefinition = {
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  itemId: {
    type: Schema.Types.String,
    required: true,
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
  },
  unitPrice: {
    type: Schema.Types.Number,
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

export interface PurchaseDocument extends Purchase, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type PurchaseModel = Model<PurchaseDocument>;

export const schema = new Schema<PurchaseDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
