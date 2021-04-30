import { HttpException, Type } from '@nestjs/common';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type Template = Record<string, unknown>;

export type Placeholder = {
  exceptionMatcher?: () => Type<HttpException>;
  resolver: (exception: HttpException) => any;
};

export interface Options<T = Template> {
  template?: T | (() => Type<unknown>);
  requiredProperties?: (keyof T)[];
  contentType?: string;
  description?: string;
  schema?: SchemaObject | ReferenceObject;
  type?: () => string | Type<unknown>;
  isArray?: boolean;
  placeholders?: Record<string, Placeholder>;
}

export interface MergedOptions extends Options {
  userDefinedTemplate?: boolean;
}
