import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/oas';
import { Route } from '../router';

export const routeOas: Route = {
  name: 'oas',
  oasPath: domainsOas.getPath('oas'),
  controllers,
};
