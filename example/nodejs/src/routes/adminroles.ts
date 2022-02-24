import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/adminroles';
import { Route } from '../router';

export const routeAdminRoles: Route = {
  name: 'adminroles',
  oasPath: domainsOas.getPath('adminroles'),
  controllers,
};
