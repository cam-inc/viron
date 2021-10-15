import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { Purchase } from '../../../domains/purchase';

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
