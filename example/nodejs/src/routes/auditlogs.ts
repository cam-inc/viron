import { domainsOas } from '@viron/lib';
import * as controllers from '../controllers/auditlogs';
import { Route } from '../router';

export const routeAuditlogs: Route = {
  name: 'auditlogs',
  oasPath: domainsOas.getPath('auditlogs'),
  controllers,
};
