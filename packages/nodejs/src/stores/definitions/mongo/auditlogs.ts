import { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { AuditLog } from '../../../domains/auditlog';

export const name = 'auditlogs';

const schemaDefinition: SchemaDefinition = {
  requestMethod: {
    type: Schema.Types.String,
    required: false,
  },
  requestUri: {
    type: Schema.Types.String,
    required: false,
  },
  sourceIp: {
    type: Schema.Types.String,
    required: false,
  },
  userId: {
    type: Schema.Types.String,
    required: false,
  },
  requestBody: {
    type: Schema.Types.String,
    required: false,
  },
  statusCode: {
    type: Schema.Types.Number,
    required: false,
  },
  createdAt: {
    type: Schema.Types.Number,
  },
  updatedAt: {
    type: Schema.Types.Number,
  },
};

export interface AuditLogDocument extends AuditLog, Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type AuditLogModel = Model<AuditLogDocument>;

export const schema = new Schema<AuditLogDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: true,
  versionKey: false,
});
