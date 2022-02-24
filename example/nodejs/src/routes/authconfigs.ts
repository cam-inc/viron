import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/authconfigs';
import { Route } from '../router';

export const routeAuthconfigs: Route = {
  name: 'authconfigs',
  oasPath: domainsOas.getPath('authconfigs'),
  controllers,
};
