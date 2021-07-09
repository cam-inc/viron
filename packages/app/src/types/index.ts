import { Document, Paths } from '$types/oas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonStringifiable = any;
export type URL = string;
export type Pathname = string;
export type EMail = string;

export type EndpointID = string;
export type Endpoint = {
  id: EndpointID;
  url: URL;
  isPrivate: boolean;
  authConfigs: AuthConfig[] | null;
  document: Document | null;
};
export type EndpointForDistribution = Endpoint & {
  authConfigs: null;
  document: null;
};

export type ClassName = string;

export type AuthConfig = {
  type: 'email' | 'oauth' | 'oauthcallback' | 'signout';
  provider: 'viron' | 'google' | 'signout';
  // This object contains only one key-value pair.
  pathObject: Paths;
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
