// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#openapi-object
export type Document = {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#versions
  openapi: Semver;
  info: Info;
  paths: Paths;
  servers?: Server[];
  components: Components;
};

// [extendable] Metadata about the API.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#infoObject
export type Info = {
  // The title of the application.
  title: string;
  // The version of the API.
  version: string;
  // A short description of the application.
  description?: string | CommonMark;
  // A URL to the Terms of Service for the API.
  termsOfService?: URL;
  // The contact information for the API.
  contact?: Contact;
  // The license information for the API.
  license?: License;
};

// CommonMark markdown used throughout the specification description fields.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#rich-text-formatting
// @see: https://spec.commonmark.org/0.27/
export type CommonMark = string;

// [extendable] Contact information for the API.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#contact-object
export type Contact = {
  // The identifying name of the contact person/organization.
  name: string;
  // The URL pointing to the contact information.
  url: URL;
  // The email address of the contact person/organization.
  email: EMail;
};

// [extendable] The license information for the API.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#license-object
export type License = {
  name: string;
  url: URL;
};

// [extendable] Holds the relative paths to the individual endpoints and their operations.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#paths-object
export type Paths = {
  // key must begin with a slash.
  [key: string]: PathItem;
};

// TODO
// [extendable] Describes the operations available on a single path
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#path-item-object
export type PathItem = {};

// [extendable] Server representation.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#server-object
export type Server = {
  // A URL to the target host.
  url: URL;
  description?: string | CommonMark;
  variables?: {
    [key: string]: ServerVariable;
  };
};

// [extendable] Representing a Server Variable for server URL template substitution.
export type ServerVariable = {
  default: string;
  description?: string | CommonMark;
  enum?: string[];
};

// [extendable] Holds a set of reusable objects for different aspects of the OAS.
// All the keys in the fiexed objects should match the regular expression '^[a-zA-Z0-9\.\-_]+$'.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#components-object
export type Components = {
  schemas?: {
    [key: string]: Schema | Reference;
  };
  responses?: {
    [key: string]: Response | Reference;
  };
  parameters?: {
    [key: string]: Parameter | Reference;
  };
  examples?: {
    [key: string]: Example | Reference;
  };
  requestBodies?: {
    [key: string]: RequestBody | Reference;
  };
  headers?: {
    [key: string]: Header | Reference;
  };
  securitySchemes?: {
    [key: string]: SecurityScheme | Reference;
  };
  links?: {
    [key: string]: Link | Reference;
  };
  callbacks?: {
    [key: string]: Callback | Reference;
  };
};

// TODO
export type Schema = {};
export type Response = {};
export type Parameter = {};
export type Example = {};
export type RequestBody = {};
export type Header = {};
export type SecurityScheme = {};
export type Link = {};
export type Callback = {};

// Semantic version number.
// @see: https://semver.org/spec/v2.0.0.html
export type Semver = string;

// A string in the format of a URL.
export type URL = string;

// A string in the format of an email address.
export type EMail = string;

// A simple object to allow referencing other components in the specification.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#reference-object
export type Reference = {
  $ref: string;
};

// Additional data to extend the specification.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#specificationExtensions
export type Extension = {
  // key must begin with "x-".
  [key: string]: any;
};
