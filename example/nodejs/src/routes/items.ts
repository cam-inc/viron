import * as controllers from '../controllers/items';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routeItems: Route = {
  name: 'items',
  oasPath: oasPath('items'),
  controllers,
};
