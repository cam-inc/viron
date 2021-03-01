export type URL = string;
export type Pathname = string;
export type EMail = string;

export type Token = string;

export type EndpointID = string;

export type Endpoint = {
  id: EndpointID;
  url: URL;
  isPrivate: boolean;
  authTypes: AuthType[];
  token: Token | null;
};

export type ClassName = string;

export type AuthType = {
  type: 'email' | 'signout' | 'oauth';
  provider: 'google';
  url: Pathname;
  method: 'POST';
};

export type AuthTypeEmailFormData = {
  email: EMail;
  password: string;
};
