import { Route } from '../router';
import { routeAdminAccounts } from './adminaccounts';
import { routeAdminRoles } from './adminroles';
import { routeAdminUsers } from './adminusers';
import { routeArticles } from './articles';
import { routeAuditlogs } from './auditlogs';
import { routeAuth } from './auth';
import { routeAuthconfigs } from './authconfigs';
import { routeItems } from './items';
import { routeMedias } from './medias';
import { routeOas } from './oas';
import { routePing } from './ping';
import { routePurchases } from './purchases';
import { routeResources } from './resources';
import { routeRoot } from './root';
import { routeUsers } from './users';

const routes: Route[] = [
  routePing,
  routeUsers,
  routePurchases,
  routeResources,
  routeArticles,
  routeItems,
  routeMedias,
  routeAdminAccounts,
  routeAdminRoles,
  routeAdminUsers,
  routeAuditlogs,
  routeAuth,
  routeAuthconfigs,
  routeOas,
  // マージ順の関係で`root`は必ず最後に書く
  routeRoot,
];

export { routes };
