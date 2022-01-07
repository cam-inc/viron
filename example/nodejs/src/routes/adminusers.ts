import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/adminusers';
import { Route } from '../router';

export const routeAdminUsers: Route = {
  name: 'adminusers',
  oasPath: domainsOas.getPath('adminusers'),
  controllers,
};
