import * as mongoose from 'mongoose';
import { DefinitionKeys } from '.';

export const name: DefinitionKeys = 'users';

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
  },
  updatedAt: {
    type: mongoose.Schema.Types.Number,
  },
};

export interface UserDocument extends mongoose.Document {
  name: string;
  nickName: string;
  createdAt: number;
  updatedAt: number;
}

export type UserModel = mongoose.Model<UserDocument>;

export const schema = new mongoose.Schema<UserDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
});
