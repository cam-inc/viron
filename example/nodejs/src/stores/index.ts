import { MongoStore } from './mongo';
import { MysqlStore } from './mysql';

export interface Stores {
  main: MongoStore | MysqlStore;
}
