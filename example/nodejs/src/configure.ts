// configure file.

import { ConnectOptions as MongoConnectOptions } from 'mongoose';
import { Options as MysqlConnectOptions } from 'sequelize';
import { Mode, MODE_MONGO, StoreType } from './constants';
import { openUri } from './stores/connection/mongo';

export interface MongoConfigure extends StoreConfigure {
  openUri: openUri;
  connectOptions: MongoConnectOptions;
}

export interface MysqlConfigure extends StoreConfigure {
  connectOptions: MysqlConnectOptions;
}

export interface StoreConfigure {
  type: StoreType;
}

export interface Configure {
  store: {
    main: MongoConfigure | MysqlConfigure;
  };
}

/**
 * Get configure data.
 */
export const get = (mode: Mode): Configure => {
  const mongo: MongoConfigure = {
    type: 'mongo',
    openUri: 'mongodb://mongo:27017',
    connectOptions: {
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
  };

  const mysql: MysqlConfigure = {
    type: 'mysql',
    connectOptions: {
      dialect: 'mysql',
      database: 'viron_example',
      username: 'root',
      password: 'password',
      host: 'mysql',
      port: 3306,
      ssl: false,
      protocol: 'tcp',
      logging: true,
    },
  };
  const ret: Configure = {
    store: {
      main: mode == MODE_MONGO ? mongo : mysql,
    },
  };

  return ret;
};
