import * as mongoose from 'mongoose';
import { User } from '../../../domains/user';

export const name = 'users';

const schemaDefinition: mongoose.SchemaDefinition = {
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  nickName: {
    type: mongoose.Schema.Types.String,
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

export interface UserDocument extends User, mongoose.Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type UserModel = mongoose.Model<UserDocument>;

export const schema = new mongoose.Schema<UserDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
