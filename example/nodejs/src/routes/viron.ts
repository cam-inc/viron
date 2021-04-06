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
} = domains.viron;

/**
 * viron全体設定を取得
 * @route GET /viron
 */
export const getViron = async (
  _context: RequestContext,
  req: Request,
  res: Response
): Promise<void> => {
  const api = genComponentApi(API_METHOD.GET, '/users');
  const query = [genComponentQuery('userId', QUERY_TYPE.STRING)];
  const components = [
    genTableComponent(api, req.i18n.t('userInfo'), 'userId', true, query, [
      'userId',
    ]),
  ];
  const pages = [
    genPage(
      'user',
      req.i18n.t('user'),
      req.i18n.t('userInfo'),
      SECTION.MANAGE,
      components
    ),
  ];
  const viron = genViron(
    COLOR.BLACK,
    THEME.STANDARD,
    req.i18n.t('title'),
    pages,
    'https://example.com/thumbnail.png',
    ['example']
  );
  res.json(viron);
};
