import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { Media } from '../../../domains/media';

export const name = 'medias';

const schemaDefinition: SchemaDefinition = {
  name: {
    type: Schema.Types.String,
    required: true,
  },
  url: {
    type: Schema.Types.String,
    required: true,
  },
  mimeType: {
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

export interface MediaDocument extends Media, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type MediaModel = Model<MediaDocument>;

export const schema = new Schema<MediaDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: true,
  versionKey: false,
});
