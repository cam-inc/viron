import {
  Success,
  Failure,
  EndpointOAuthIllegalResponseError,
  Result,
} from '~/errors';
import { Responses } from '~/types/oas';

export const extractAuthorizationUrl = (
  responses: Responses,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): Result<string, EndpointOAuthIllegalResponseError> => {
  const response = responses['200'];
  if (!response || !response.content?.['application/json']) {
    return new Failure(new EndpointOAuthIllegalResponseError());
  }
  const schema = response.content['application/json'].schema;
  if (!schema.properties) {
    return new Failure(new EndpointOAuthIllegalResponseError());
  }

  const uriKey = Object.keys(schema.properties).find((key) => {
    const property = schema.properties?.[key];
    return property?.type === 'string' && property.format === 'uri';
  });
  if (!uriKey) {
    return new Failure(new EndpointOAuthIllegalResponseError());
  }

  return new Success(json[uriKey]);
};
