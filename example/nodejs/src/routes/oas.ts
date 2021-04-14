import { RouteContext } from '.';

/**
 * oas取得
 * @route GET /oas
 */
export const getOas = async (context: RouteContext): Promise<void> => {
  context.res.json(context.apiDefinition);
};
