import { FindOptions, Sequelize, WhereOptions } from 'sequelize';
import { domainsAuth } from '../../domains';
import { RevokedTokenModelStatic } from '../../infrastructures/mysql/models/revokedtokens';
import { repositoryContainer } from '..';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '../../helpers';

const getModel = (): RevokedTokenModelStatic => {
  const conn = repositoryContainer.conn as Sequelize;
  return conn.models.revokedtokens as RevokedTokenModelStatic;
};

export const findOneById = async (
  id: string
): Promise<domainsAuth.RevokedToken | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as domainsAuth.RevokedToken) : null;
};

export const find = async (
  conditions: WhereOptions<domainsAuth.RevokedToken> = {},
  sort: string[] | null = null,
  options: FindOptions<domainsAuth.RevokedToken> = {}
): Promise<domainsAuth.RevokedToken[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as domainsAuth.RevokedToken);
};

export const findWithPager = async (
  conditions: WhereOptions<domainsAuth.RevokedToken> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<domainsAuth.RevokedToken>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as domainsAuth.RevokedToken),
  };
};

export const findOne = async (
  conditions: WhereOptions<domainsAuth.RevokedToken> = {}
): Promise<domainsAuth.RevokedToken | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
  });
  return doc ? (doc.toJSON() as domainsAuth.RevokedToken) : null;
};

export const count = async (
  conditions: WhereOptions<domainsAuth.RevokedToken> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: normalizeMysqlFilterQuery(conditions) });
};

export const createOne = async (
  revokedToken: domainsAuth.RevokedTokenCreateAttributes
): Promise<domainsAuth.RevokedToken> => {
  const model = getModel();
  const doc = await model.create(revokedToken);
  return doc.toJSON() as domainsAuth.RevokedToken;
};
