import * as controllers from '../controllers/ping';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routePing: Route = {
  name: 'ping',
  oasPath: oasPath('ping'),
  controllers,
};
