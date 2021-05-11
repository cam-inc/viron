import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { AdminUser } from '../../../domains/adminuser';

export const name = 'adminusers';

const schemaDefinition: SchemaDefinition = {
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  authType: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
  },
  salt: {
    type: Schema.Types.String,
  },
  createdAt: {
    type: Schema.Types.Number,
  },
  updatedAt: {
    type: Schema.Types.Number,
  },
};

export interface AdminUserDocument extends AdminUser, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type AdminUserModel = Model<AdminUserDocument>;

export const schema = new Schema<AdminUserDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: true,
  versionKey: false,
});
