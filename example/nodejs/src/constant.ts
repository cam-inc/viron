export const modeMysql = 'mysql';
export const modeMongo = 'mongo';
export type mode = typeof modeMysql | typeof modeMongo;
export type storeType = mode;
