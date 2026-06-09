// Exact copy of types from @nestjs/swagger/dist/interfaces/open-api-spec.interface
// (inaccessible via deep import since v11.4.3)

export interface ReferenceObject {
  $ref: string;
}

export type OpenAPIFormat =
  | 'int32'
  | 'int64'
  | 'float'
  | 'double'
  | 'byte'
  | 'binary'
  | 'date'
  | 'date-time'
  | 'time'
  | 'duration'
  | 'password'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uri'
  | 'uri-reference'
  | 'uri-template'
  | 'iri'
  | 'iri-reference'
  | 'uuid'
  | 'json-pointer'
  | 'relative-json-pointer'
  | 'regex'
  | string;

export interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

export interface DiscriminatorObject {
  propertyName: string;
  mapping?: Record<string, string>;
}

export interface XmlObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export interface SchemaObject {
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XmlObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  examples?: any[] | Record<string, any>;
  deprecated?: boolean;
  type?: string;
  allOf?: (SchemaObject | ReferenceObject)[];
  oneOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  not?: SchemaObject | ReferenceObject;
  items?: SchemaObject | ReferenceObject;
  properties?: Record<string, SchemaObject | ReferenceObject>;
  additionalProperties?: SchemaObject | ReferenceObject | boolean;
  patternProperties?: SchemaObject | ReferenceObject | any;
  description?: string;
  format?: OpenAPIFormat;
  default?: any;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  'x-enumNames'?: string[];
}

export interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export type ExamplesObject = Record<string, ExampleObject | ReferenceObject>;

export interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject;
  examples?: ExamplesObject;
  example?: any;
}

export type ContentObject = Record<string, MediaTypeObject>;
