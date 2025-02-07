import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { AdminUser } from '../../../domains/adminuser';

export const name = 'adminusers';

export const schemaDefinition: SchemaDefinition = {
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  authType: {
    type: Schema.Types.String,
    required: true,
  },
  // for email
  password: {
    type: Schema.Types.String,
  },
  salt: {
    type: Schema.Types.String,
  },
  // for google
  googleOAuth2AccessToken: {
    type: Schema.Types.String,
  },
  googleOAuth2ExpiryDate: {
    type: Schema.Types.Number,
  },
  googleOAuth2IdToken: {
    type: Schema.Types.String,
  },
  googleOAuth2RefreshToken: {
    type: Schema.Types.String,
  },
  googleOAuth2TokenType: {
    type: Schema.Types.String,
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

export interface AdminUserDocument extends AdminUser, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type AdminUserModel = Model<AdminUserDocument>;

export const schema = new Schema<AdminUserDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
