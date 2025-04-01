import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { AdminUserSsoToken } from '../../../domains/adminuserssotoken';

export const name = 'adminuserssotokens';

export const schemaDefinition: SchemaDefinition = {
  authType: {
    type: Schema.Types.String,
    required: true,
  },
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  clientId: {
    type: Schema.Types.String,
    required: true,
  },
  provider: {
    type: Schema.Types.String,
    required: true,
  },
  accessToken: {
    type: Schema.Types.String,
    required: true,
  },
  expiryDate: {
    type: Schema.Types.Number,
    required: true,
  },
  idToken: {
    type: Schema.Types.String,
    required: true,
  },
  refreshToken: {
    type: Schema.Types.String,
  },
  tokenType: {
    type: Schema.Types.String,
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

export interface AdminUserSsoTokenDocument extends AdminUserSsoToken, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type AdminUserSsoTokenModel = Model<AdminUserSsoTokenDocument>;

export const schema = new Schema<AdminUserSsoTokenDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
}).index({ userId: 1, clientId: 1 }, { unique: true });
