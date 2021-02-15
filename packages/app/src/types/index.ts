import { Document } from '$types/oas';

export type URL = string;
export type EMail = string;

export type EndpointID = string;

export type Endpoint = {
  id: EndpointID;
  url: URL;
  document?: Document;
};
