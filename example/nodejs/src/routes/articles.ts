import * as controllers from '../controllers/articles';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routeArticles: Route = {
  name: 'articles',
  oasPath: oasPath('articles'),
  controllers,
};
