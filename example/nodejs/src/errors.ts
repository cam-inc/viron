import { modeMongo, modeMysql } from './constant';

export const newNoSetEnvMode = (): Error => {
  return new Error(
    `The environment variable is not set. key=MODE, value=${modeMongo} or ${modeMysql}`
  );
};
