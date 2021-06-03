import { Document, Paths } from '$types/oas';

export type URL = string;
export type Pathname = string;
export type EMail = string;

export type EndpointID = string;

export type Endpoint = {
  id: EndpointID;
  url: URL;
  isPrivate: boolean;
  authTypes: AuthType[];
  document: Document | null;
};

export type ClassName = string;

export type AuthType = {
  type: 'email' | 'oauth' | 'signout';
  // TODO: 全リスト項目とその役割を確認すること。
  provider: 'viron' | 'google' | 'signout';
  // This object contains only one key-value pair.
  pathObject: Paths;
};

export type AuthTypeEmailFormData = {
  email: EMail;
  password: string;
};
