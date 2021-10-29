import * as controllers from '../controllers/medias';
import { oasPath } from '../domains/oas';
import { Route } from '../router';

export const routeMedias: Route = {
  name: 'media',
  oasPath: oasPath('medias'),
  controllers,
};
