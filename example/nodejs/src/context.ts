import pino from 'pino';
import { mode, modeMongo, modeMysql } from './constant';
import { preflight as preflightMongo } from './stores/mongo';
import { Definitions } from './stores/definitions/mongo';

import { Configure, get as getConfigure, MongoConfigure } from './configure';
import { Stores } from './stores';

export const logger = pino({
  name: 'example',
  level: 'debug',
  timestamp: true,
});

const newNoSetEnvMode = (): Error => {
  return new Error(
    `The environment variable is not set. key=MODE, value=${modeMongo} or ${modeMysql}`
  );
};

// default merge case
export const defaultMergeDefinitions = async (
  fn: () => Definitions
): Promise<Definitions> => {
  return Object.assign({}, fn());
};

export class Context {
  public mode: mode;
  public configure: Configure;
  public stores!: Stores;

  constructor() {
    switch (process.env.MODE) {
      case modeMongo:
        this.mode = modeMongo;
        break;
      case modeMysql:
        this.mode = modeMysql;
        break;
      default:
        throw newNoSetEnvMode();
    }

    this.configure = getConfigure(this.mode);
  }

  public async preflight(): Promise<void> {
    await this.preflightStore();
  }

  /**
   * Preflight store
   */
  public async preflightStore(): Promise<void> {
    const mainConfig = this.configure.store.main;
    switch (this.mode) {
      case modeMongo:
        // eslint-disable-next-line no-case-declarations
        const configure = mainConfig as MongoConfigure;
        this.stores = {
          main: await preflightMongo(configure),
        };

        logger.info(
          `Completed loading the store (main). type=${configure.type}, openUri=${configure.openUri}`
        );
        break;
      case modeMysql:
        logger.error('TODO not support.');
        break;
      default:
        throw newNoSetEnvMode();
    }
  }
}

export const ctx = new Context();
