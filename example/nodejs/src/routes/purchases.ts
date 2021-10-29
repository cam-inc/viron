import * as controllers from '../controllers/purchases';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routePurchases: Route = {
  name: 'purchases',
  oasPath: oasPath('purchases'),
  controllers,
};
