import { Schema, SchemaTypes } from 'mongoose';

export const defaultName = 'topics';

export const create = (name: string = defaultName): Schema => {
  const schema = new Schema(
    {
      createdAt: {
        type: SchemaTypes.Number,
      },
      updatedAt: {
        type: SchemaTypes.Number,
      },
    },
    {
      autoIndex: true,
      collection: name,
      strict: true,
      timestamps: true,
    }
  );

  return schema;
};
