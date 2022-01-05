import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/auth';
import { Route } from '../router';

export const routeAuth: Route = {
  name: 'auth',
  oasPath: domainsOas.getPath('auth'),
  controllers,
};
