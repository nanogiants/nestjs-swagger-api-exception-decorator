import { Type } from '@nestjs/common';

import { ReferenceObject, SchemaObject } from '../interfaces/open-api.interface';

// Mirrors @nestjs/swagger/dist/constants — string values stable across all major versions
const DECORATORS_PREFIX = 'swagger';

export const DECORATORS = {
  API_OPERATION: `${DECORATORS_PREFIX}/apiOperation`,
  API_RESPONSE: `${DECORATORS_PREFIX}/apiResponse`,
  API_MODEL_PROPERTIES: `${DECORATORS_PREFIX}/apiModelProperties`,
  API_MODEL_PROPERTIES_ARRAY: `${DECORATORS_PREFIX}/apiModelPropertiesArray`,
} as const;

// Mirrors @nestjs/swagger/dist/interfaces/schema-object-metadata.interface
type AnyCallable = (...args: any[]) => any;

type EnumSchemaAttributes = Pick<
  SchemaObject,
  'default' | 'description' | 'deprecated' | 'readOnly' | 'writeOnly' | 'nullable'
>;

type EnumAllowedTypes = any[] | Record<string, any> | (() => any[] | Record<string, any>);

type SchemaObjectCommonMetadata = Omit<SchemaObject, 'type' | 'required' | 'properties' | 'enum' | 'pattern'> & {
  isArray?: boolean;
  name?: string;
  pattern?: string | RegExp;
  enum?: EnumAllowedTypes;
};

export type SchemaObjectMetadata =
  | (SchemaObjectCommonMetadata & {
      type?:
        | Type<unknown>
        | AnyCallable
        | [AnyCallable]
        | 'array'
        | 'string'
        | 'number'
        | 'boolean'
        | 'integer'
        | 'file'
        | 'null';
      required?: boolean;
    })
  | ({
      type?: Type<unknown> | AnyCallable | [AnyCallable] | Record<string, any>;
      required?: boolean;
      enumName: string;
      enumSchema?: EnumSchemaAttributes;
    } & SchemaObjectCommonMetadata)
  | ({
      type: 'object';
      properties: Record<string, SchemaObjectMetadata>;
      required?: string[];
      selfRequired?: boolean;
    } & SchemaObjectCommonMetadata)
  | ({
      type: 'object';
      properties?: Record<string, SchemaObjectMetadata>;
      additionalProperties: SchemaObject | ReferenceObject | boolean;
      required?: string[];
      selfRequired?: boolean;
    } & SchemaObjectCommonMetadata);

// Mirrors @nestjs/swagger/dist/decorators/helpers — getTypeIsArrayTuple
export const getTypeIsArrayTuple = (
  input: AnyCallable | [AnyCallable] | undefined | string | Record<string, any>,
  isArrayFlag: boolean,
): [AnyCallable | undefined, boolean] => {
  if (!input) {
    return [input as undefined, isArrayFlag];
  }
  if (isArrayFlag) {
    return [input as AnyCallable, isArrayFlag];
  }
  const isInputArray = Array.isArray(input);
  const type = isInputArray ? (input as [AnyCallable])[0] : (input as AnyCallable);
  return [type, isInputArray];
};

// Mirrors @nestjs/swagger/dist/services/model-properties-accessor (getModelProperties only)
export class ModelPropertiesAccessor {
  getModelProperties(prototype: Type<unknown>): string[] {
    const properties: string[] = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, prototype) ?? [];
    return properties
      .filter((key): key is string => typeof key === 'string')
      .filter(
        key => key.charAt(0) === ':' && typeof (prototype as unknown as Record<string, unknown>)[key] !== 'function',
      )
      .map(key => key.slice(1));
  }
}
