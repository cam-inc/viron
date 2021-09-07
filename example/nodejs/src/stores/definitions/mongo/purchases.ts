import * as mongoose from 'mongoose';
import { Purchase } from '../../../domains/purchase';

export const name = 'purchases';

const schemaDefinition: mongoose.SchemaDefinition = {
  userId: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  unitPrice: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  createdAt: {
    type: mongoose.Schema.Types.Number,
    get: (createdAt: number) => new Date(createdAt * 1000),
  },
  updatedAt: {
    type: mongoose.Schema.Types.Number,
    get: (updatedAt: number) => new Date(updatedAt * 1000),
  },
};

export interface PurchaseDocument extends Purchase, mongoose.Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type PurchaseModel = mongoose.Model<PurchaseDocument>;

export const schema = new mongoose.Schema<PurchaseDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
