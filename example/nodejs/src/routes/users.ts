import * as controllers from '../controllers/users';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routeUsers: Route = {
  name: 'users',
  oasPath: oasPath('users'),
  controllers,
};
