import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/adminaccounts';
import { Route } from '../router';

export const routeAdminAccounts: Route = {
  name: 'adminaccounts',
  oasPath: domainsOas.getPath('adminaccounts'),
  controllers,
};
