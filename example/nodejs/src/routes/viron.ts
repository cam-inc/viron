import { constants, domains } from '@viron/lib';
import { Response, Request } from 'express';
import { Context as RequestContext } from 'openapi-backend';

const { COLOR, THEME, SECTION, API_METHOD, QUERY_TYPE } = constants;

const {
  genComponentApi,
  genComponentQuery,
  genTableComponent,
  genPage,
  genViron,
} = domains.structures;

/**
 * viron全体設定を取得
 * @route GET /viron
 */
export const get = async (
  _context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  const api = genComponentApi(API_METHOD.GET, '/users');
  const query = [genComponentQuery('userId', QUERY_TYPE.STRING)];
  const components = [
    genTableComponent(api, 'ユーザー情報', 'userId', true, query, ['userId']),
  ];
  const pages = [
    genPage('user', 'ユーザー', 'ユーザー情報', SECTION.MANAGE, components),
  ];
  const viron = genViron(
    COLOR.BLACK,
    THEME.STANDARD,
    'Viron Example for Node.js/TypeScript',
    pages,
    'https://example.com/thumbnail.png',
    ['example']
  );
  res.json(viron);
};
