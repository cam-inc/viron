import * as controllers from '../controllers/resources';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routeResources: Route = {
  name: 'resources',
  oasPath: oasPath('resources'),
  controllers,
};
