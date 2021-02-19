import { Document } from '$types/oas';

export type URL = string;
export type Pathname = string;
export type EMail = string;

export type EndpointID = string;

export type Endpoint = {
  id: EndpointID;
  url: URL;
  document?: Document;
};

export type ClassName = string;

export type AuthType = {
  type: 'email' | 'signout' | 'oauth';
  provider: string;
  url: Pathname;
  method: 'POST';
};
