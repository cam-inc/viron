import * as mongoose from 'mongoose';
import { DefinitionKeys } from '.';

export const name: DefinitionKeys = 'topics';

const schemaDefinition: mongoose.SchemaDefinition = {
  name: {
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

export interface TopicDocument extends mongoose.Document {
  name: string;
  createdAt: number;
  updatedAt: number;
}

export type TopicModel = mongoose.Model<TopicDocument>;

export const schema = new mongoose.Schema<TopicDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
});
