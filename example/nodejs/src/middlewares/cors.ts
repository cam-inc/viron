import cors from 'cors';
import { RequestHandler } from 'express';
import {
  ACCESS_CONTROL_ALLOW_CREDENTIALS,
  ACCESS_CONTROL_ALLOW_HEADERS,
  ACCESS_CONTROL_ALLOW_METHODS,
  ACCESS_CONTROL_EXPOSE_HEADERS,
} from '@viron/lib';
import { CorsConfig } from '../config';

export const middlewareCors = (config: CorsConfig): RequestHandler => {
  return cors({
    origin: config.allowOrigins,
    methods: [...ACCESS_CONTROL_ALLOW_METHODS],
    allowedHeaders: [...ACCESS_CONTROL_ALLOW_HEADERS],
    exposedHeaders: [...ACCESS_CONTROL_EXPOSE_HEADERS],
    credentials: ACCESS_CONTROL_ALLOW_CREDENTIALS,
  });
};
