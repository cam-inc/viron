import pino from 'pino';
import { modeMongo, modeMysql } from './constant';

import {
  preflight as preflightMongo,
  createDefinitions as createDefinitionsMongo,
} from './stores/connection/mongo';

export const logger = pino({
  name: 'example',
  level: 'debug',
  timestamp: true,
});

export class Context {
  public mode: string;
  constructor() {
    switch (process.env.MODE) {
      case modeMongo:
        this.mode = modeMongo;
        break;
      case modeMysql:
        this.mode = modeMysql;
        break;
      default:
        throw new Error(
          'The environment variable is not set. key=MODE, value=`mongo` or `mysql`'
        );
    }
  }

  public async preflight(): Promise<void> {
    switch (this.mode) {
      case modeMongo:
        await preflightMongo(
          'mongodb://mongo:27017',
          {
            // MongoDB Options
            dbName: 'viron_example',
            autoIndex: true,
            user: 'root',
            pass: 'password',
            useNewUrlParser: true,
            useCreateIndex: true,
            authSource: 'admin',
            useFindAndModify: false,
            useUnifiedTopology: true,
          },
          Object.assign(createDefinitionsMongo())
        );
        break;
      case modeMysql:
        logger.error('TODO not support.');
        break;
    }
  }
}

export const ctx = new Context();
