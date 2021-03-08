import { SecurityScope } from 'openapi-security-handler';
import { OpenAPI, OpenAPIV2 } from 'openapi-types';

export const jwt = async (
  _req: OpenAPI.Request,
  scopes: SecurityScope[],
  definition: OpenAPIV2.SecuritySchemeObject // https://github.com/kogosoftwarellc/open-api/pull/714
): Promise<boolean> => {
  // TODO: implements
  console.log(scopes);
  console.log(definition);
  return true;
};
