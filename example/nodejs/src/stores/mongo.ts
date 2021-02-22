import { MongoConfigure } from '../configure';
import { storeType, modeMongo } from '../constant';
import { createConnection } from './connection/mongo';
import { definitions, Definitions, Models, models } from './definitions/mongo';

export interface Store {
  type: storeType;
  definitions: Definitions;
  models: Models;
}

export const preflight = async (config: MongoConfigure): Promise<Store> => {
  const c = await createConnection(config.openUri, config.connectOptions);

  return {
    type: modeMongo,
    definitions: definitions,
    models: await models(c),
  };
};
