// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#openapi-object
export type Document = {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#versions
  openapi: Semver;
  info: Info;
  paths: Paths;
  servers?: Server[];
  components?: Components;
  security?: SecurityRequirement[];
  tags?: Tag[];
  externalDocs?: ExternalDocumentation;
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

// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#tag-object
export type Tag = {
  name: string;
  description?: string | CommonMark;
  externalDocs?: ExternalDocumentation;
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

// [extendable] Allows the definition of input and output data types. This is an extended subset of JSON Schema Specification Wright Draft 00.
// For more information about the properties, see JSON Schema Core and JSON Schema Validation. Unless stated otherwise, the property definitions follow the JSON Schema.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#schema-object
// @see: http://json-schema.org/
// @see: https://tools.ietf.org/html/draft-wright-json-schema-00
// @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00
export type Schema = {
  /**
   * The following properties are taken directly from the JSON Schema definition and follow the same specifications:
   */
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-6.1
  title?: string;
  // Must be greater then 0.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.1
  multipleOf?: number;
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.2
  maximum?: number;
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.3
  exclusiveMaximum?: boolean;
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.4
  minimum?: number;
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.5
  exclusiveMinimum?: boolean;
  // Must be a non-negative integer.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.6
  maxLength?: number;
  // Must be a non-negative integer.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.7
  minLength?: number;
  // Should be a valid regular expression following to the ECMA 262 regular expression dialect.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.8
  // @see: https://262.ecma-international.org/5.1/#sec-7.8.5
  pattern?: string;
  // Must be a non-negative integer.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.10
  maxItems?: number;
  // Must be a non-negative integer.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.11
  minItems?: number;
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.12
  uniqueItems?: boolean;
  // Must be a non-negative integer.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.13
  maxProperties?: number;
  // Must be a non-negative integer.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.14
  minProperties?: number;
  // Elements of the array must be unique.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.15
  required?: string[];
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.20
  enum?: any[];
  /**
   * The following properties are taken from the JSON Schema definition but their definitions were adjusted to the OpenAPI Specification.
   */
  // TODO: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#data-types に `null is not supported as a type`って書いてあるから以下unionから外すべきかも。
  // Multiple types via an array are not supported.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.21
  type?:
    | 'string'
    | 'number'
    | 'integer'
    | 'object'
    | 'array'
    | 'boolean'
    | 'null';
  // Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.22
  allOf?: Schema[] | Reference[];
  // Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.24
  oneOf?: Schema[] | Reference[];
  // Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.23
  anyOf?: Schema[] | Reference[];
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.25
  not?: Schema | Reference;
  // Value MUST be an object and not an array. Inline or referenced schema MUST be of a Schema Object and not a standard JSON
  // Items MUST be present if the type is array.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.9
  items?: Schema | Reference;
  // Property definitions MUST be a Schema Object and not a standard JSON Schema (inline or referenced).
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.16
  properties?: {
    [key: string]: Schema | Reference;
  };
  // Value can be boolean or object. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. Consistent with JSON Schema, additionalProperties defaults to true.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-5.18
  additionalProperties?: boolean | Schema | Reference;
  // CommonMark syntax allowed.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-6.1
  description?: string | CommonMark;
  // See Data Type Formats for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
  // formats below are OAS specific ones.
  // - date: As defined by full-date (RFC3339)
  // - date-time: As defined by date-time (RFC3339)
  // - password: A hint to UIs to obscure input.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#dataTypeFormat
  format?:
    | 'date-time'
    | 'email'
    | 'hostname'
    | 'ipv4'
    | 'ipv6'
    | 'date'
    | 'date-time'
    | 'password';
  // The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level. For example, if type is string, then default can be "foo" but cannot be 1.
  // @see: https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-6.2
  default?: any;
  /**
   * Other than the JSON Schema subset fields, the following fields MAY be used for further schema documentation.
   */
  // Allows sending a null value for the defined schema. Default value is false.
  nullable?: boolean;
  // Adds support for polymorphism. The discriminator is an object name that is used to differentiate between other schemas which may satisfy the payload description.
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#schemaComposition
  discriminator?: Discriminator;
  // Default to false.
  readOnly?: boolean;
  // Default to false.
  writeOnly?: boolean;
  // This MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property.
  xml?: XML;
  // Additional external documentation for this schema.
  externalDocs?: ExternalDocumentation;
  // A free-form property to include an example of an instance for this schema.
  example?: any;
  // Default to false.
  deprecated?: boolean;
};

// When request bodies or response payloads may be one of a number of different schemas, a discriminator object can be used to aid in serialization, deserialization, and validation.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#discriminator-object
export type Discriminator = {
  propertyName: string;
  mapping?: {
    [key: string]: string;
  };
};

// [extendable] A metadata object that allows for more fine-tuned XML model definitions.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#xml-object
export type XML = {
  name?: string;
  namespace?: string;
  prefix?: string;
  // Default to false.
  attribute?: boolean;
  // Default to false.
  wrapped?: boolean;
};

// [extendable] Allows referencing an external resource for extended documentation.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#external-documentation-object
export type ExternalDocumentation = {
  url: URL;
  description?: string | CommonMark;
};

// [extendable] Describes a single response from an API Operation, including design-time, static links to operations based on the response.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#response-object
export type Response = {
  description: string | CommonMark;
  headers?: {
    [key: string]: Header | Reference;
  };
  // A map containing descriptions of potential response payloads.
  content?: {
    [key: string]: MediaType;
  };
  links: {
    [key: string]: Link | Reference;
  };
};

// [extendable] Describes a single operation parameter.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#parameter-object
export type Parameter = {
  name: string;
  // The location of the parameter.
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string | CommonMark;
  //  If the parameter location is "path", this property is REQUIRED and its value MUST be true.
  required?: boolean;
  deprecated?: boolean;
  // Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false.
  allowEmptyValue?: boolean;
  // Describes how the parameter value will be serialized depending on the type of the parameter value.
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;
  // The schema defining the type used for the parameter.
  schema?: Schema | Reference;
  example?: any;
  examples?: {
    [key: string]: Example | Reference;
  };
  content?: {
    // A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.
    [key: string]: MediaType;
  };
};

// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#style-values
export type Style =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject';

// [extendable]
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#example-object
export type Example = {
  summary?: string;
  description?: string | CommonMark;
  value?: any;
  externalValue?: URL;
};

// [Extendable] Describes a single request body.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#request-body-object
export type RequestBody = {
  content: {
    [key: string]: MediaType;
  };
  description?: string | CommonMark;
  required?: boolean;
};

// The Header Object follows the structure of the Parameter Object with the following changes:
// 1. name MUST NOT be specified, it is given in the corresponding headers map.
// 2. in MUST NOT be specified, it is implicitly in header.
// 3. All traits that are affected by the location MUST be applicable to a location of header (for example, style).
// TODO: deal with no.3 above.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#header-object
export type Header = Omit<Parameter, 'name' | 'in'>;

// Lists the required security schemes to execute this operation.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#security-requirement-object
export type SecurityRequirement = {
  [key: string]: string[];
};

// [extendable] Defines a security scheme that can be used by the operations.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#security-scheme-object
export type SecurityScheme = {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string | CommonMark;
  // Required when the type is apiKey.
  name?: string;
  // Required when the type is apiKey.
  in?: 'query' | 'header' | 'cookie';
  // Required when the type is http.
  scheme?: string;
  bearerFormat?: string;
  // Required when the type is oauth2.
  flows?: OAuthFlows;
  // Required when the type is openIdConnect.
  openIdConnectUrl?: URL;
};

// [extendable] Allows configuration of the supported OAuth Flows.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#oauth-flows-object
export type OAuthFlows = {
  implicit?: OAuthFlow;
  password?: OAuthFlow;
  clientCredentials?: OAuthFlow;
  authorizationCode: OAuthFlow;
};

// [extendable] Configuration details for a supported OAuth Flow.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#oauth-flow-object
export type OAuthFlow = {
  authorizationUrl: URL;
  tokenUrl: URL;
  refreshUrl?: URL;
  scopes: {
    [key: string]: string;
  };
};

// [extendable] Represents a possible design-time link for a response.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#link-object
export type Link = {
  operationRef?: string;
  operationId?: string;
  parameters?: {
    [key: string]: any | RuntimeExpression;
  };
  requestBody?: any | RuntimeExpression;
  description?: string | CommonMark;
  server?: Server;
};

// [extendable] A map of possible out-of band callbacks related to the parent operation.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#callback-object
export type Callback = {
  // key sould be type of RuntimeExpression.
  [key: string]: PathItem;
};

// TODO: Type correctly.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#runtime-expressions
export type RuntimeExpression = string;

// [extendable] Provides schema and examples for the media type identified by its key.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#media-type-object
export type MediaType = {
  schema?: Schema | Reference;
  example?: any;
  examples?: {
    [key: string]: Example | Reference;
  };
  encoding: {
    [key: string]: Encoding;
  };
};

// [extendable] A single encoding definition applied to a single schema property.
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#encoding-object
export type Encoding = {
  contentType?: string;
  headers?: {
    [key: string]: Header | Reference;
  };
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;
};

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
