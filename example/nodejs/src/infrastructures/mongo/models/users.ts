import { mongo } from '@viron/lib';
import { User } from '../../../domains/user';
type Document = mongo.mongoose.Document;
type Model<T> = mongo.mongoose.Model<T>;
type SchemaDefinition = mongo.mongoose.SchemaDefinition;
const Schema = mongo.mongoose.Schema;

export const name = 'users';

const schemaDefinition: SchemaDefinition = {
  name: {
    type: Schema.Types.String,
    required: true,
  },
  nickName: {
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

export interface UserDocument extends User, Document {
  id: string; // Docmentのidがanyなので上書き
}

export type UserModel = Model<UserDocument>;

export const schema = new Schema<UserDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
