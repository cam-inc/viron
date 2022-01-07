import {
  RequestParametersValue,
  RequestRequestBodyValue,
  Document,
  OperationId,
} from '~/types/oas';

export const COLOR_SYSTEM = {
  PRIMARY: 'primary',
  PRIMARY_CONTAINER: 'primary-container',
  SECONDARY: 'secondary',
  SECONDARY_CONTAINER: 'secondary-container',
  TERTIARY: 'tertiary',
  TERTIARY_CONTAINER: 'tertiary-container',
  ERROR: 'error',
  ERROR_CONTAINER: 'error-container',
  SURFACE: 'surface',
  SURFACE_VARIANT: 'surface-variant',
  BACKGROUND: 'background',
} as const;
export type ColorSystem = typeof COLOR_SYSTEM[keyof typeof COLOR_SYSTEM];

export type JsonStringifiable = Parameters<typeof JSON.stringify>[0];
export type URL = string;
export type Pathname = string;
export type EMail = string;

export type EndpointGroupID = string;
export type EndpointGroup = {
  id: EndpointGroupID;
  name: string;
};

export type EndpointID = string;
export type Endpoint = {
  id: EndpointID;
  url: URL;
  isPrivate: boolean;
  authConfigs?: AuthConfigsResponse;
  document?: Document;
  group?: EndpointGroup;
};
export type EndpointForDistribution = Pick<Endpoint, 'id' | 'url'>;

export type Distribution = {
  endpointList: EndpointForDistribution[];
  endpointGroupList: EndpointGroup[];
};

export type ClassName = string;

export type AuthConfig = {
  type: 'email' | 'oauth' | 'oauthcallback' | 'signout';
  provider: 'viron' | 'google' | 'signout';
  operationId: OperationId;
  defaultParametersValue?: RequestParametersValue;
  defaultRequestBodyValue?: RequestRequestBodyValue;
};

export type AuthConfigsResponse = {
  list: AuthConfig[];
  oas: Document;
};

export type __AuthConfig = {
  type: 'oauthcallback';
  provider: 'viron' | 'google' | 'signout';
  // This object contains only one key-value pair.
  pathObject: {
    '/xxxx': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key in string]: any;
    };
  };
  defaultParametersValue: {
    redirectUri: '__VIRON_CALLBACK__';
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultRequestBodyValue: any;
};

// colors
export type Red = number;
export type Green = number;
export type Blue = number;
export type Alpha = number;
export type RGB = {
  r: Red;
  g: Green;
  b: Blue;
};
export type RGBA = RGB & {
  a: Alpha;
};
export type Hue = number;
export type Saturation = number;
export type Lightness = number;
export type HSL = {
  h: Hue;
  s: Saturation;
  l: Lightness;
};
export type Hex = string;
