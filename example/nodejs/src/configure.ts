// configure file.

import { ConnectOptions } from 'mongoose';
import { mode, modeMongo, storeType } from './constant';
import { openUri } from './stores/connection/mongo';

export interface MongoConfigure extends StoreConfigure {
  openUri: openUri;
  connectOptions: ConnectOptions;
}

export type MysqlConfigure = StoreConfigure; // TODO

export interface StoreConfigure {
  type: storeType;
}

export interface Configure {
  store: {
    main: MongoConfigure | MysqlConfigure;
  };
}

/**
 * Get configure data.
 */
export const get = (mode: mode): Configure => {
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
  };
  const ret: Configure = {
    store: {
      main: mode === modeMongo ? mongo : mysql,
    },
  };

  return ret;
};
