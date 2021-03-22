export const modeMysql = 'mysql';
export const modeMongo = 'mongo';
export type Mode = typeof modeMysql | typeof modeMongo;
export type StoreType = Mode;
