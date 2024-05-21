import { Responses } from '~/types/oas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractAuthorizationUrl = (responses: Responses, json: any) => {
  const response = responses['200'];
  if (!response || !response.content?.['application/json']) {
    return null;
  }
  const schema = response.content['application/json'].schema;
  if (!schema.properties) {
    return null;
  }
  const uriKey = Object.keys(schema.properties).find((key) => {
    const property = schema.properties?.[key];
    return property?.type === 'string' && property.format === 'uri';
  });
  if (uriKey) {
    return json[uriKey];
  }
};
