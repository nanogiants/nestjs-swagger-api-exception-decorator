import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type Template = Record<string, unknown>;

export interface Options<T = Template> {
  template?: T;
  requiredProperties?: (keyof T)[];
  contentType?: string;
  description?: string;
  schema?: SchemaObject | ReferenceObject;
  // eslint-disable-next-line @typescript-eslint/ban-types
  type?: () => string | Function;
  isArray?: boolean;
}

export interface MergedOptions extends Options {
  userDefinedTemplate?: boolean;
}
