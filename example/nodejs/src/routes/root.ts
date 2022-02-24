import * as controllers from '../controllers/root';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routeRoot: Route = {
  name: 'root',
  oasPath: oasPath('root'),
  controllers,
};
