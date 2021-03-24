import * as mongoose from 'mongoose';
import { AuditLog } from '../../../domains/auditlog';

export const name = 'auditlogs';

const schemaDefinition: mongoose.SchemaDefinition = {
  requestMethod: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  requestUri: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  sourceIp: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  requestBody: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  statusCode: {
    type: mongoose.Schema.Types.Number,
    required: false,
  },
  createdAt: {
    type: mongoose.Schema.Types.Number,
  },
  updatedAt: {
    type: mongoose.Schema.Types.Number,
  },
};

export interface AuditLogDocument extends AuditLog, mongoose.Document {
  id: string; // mongoose.Docmentのidがanyなので上書き
}

export type AuditLogModel = mongoose.Model<AuditLogDocument>;

export const schema = new mongoose.Schema<AuditLogDocument>(schemaDefinition, {
  autoIndex: true,
  collection: name,
  strict: true,
  timestamps: { currentTime: (): number => Math.floor(Date.now() / 1000) },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: true,
  versionKey: false,
});
