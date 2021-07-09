import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { getTypeIsArrayTuple } from '@nestjs/swagger/dist/decorators/helpers';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';

import { MergedOptions, Template } from '../interfaces/options.interface';

const accessor = new ModelPropertiesAccessor();

const isFunction = (func: unknown): func is (...args: any[]) => boolean => typeof func === 'function';

const isClass = (func: unknown) =>
  typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));

const resolveLazyTypeFunction = (type: SchemaObjectMetadata['type']): any =>
  isFunction(type) && !isClass(type) && type.name === 'type' ? type() : type;

const getExampleValue = (metadata: SchemaObjectMetadata) => {
  if (metadata.example !== undefined) {
    return metadata.isArray ? [metadata.example] : metadata.example;
  }

  if (metadata.enum?.length) {
    return metadata.enum[0];
  }

  return (metadata.type as () => void).name;
};

interface ExampleResponseSettings {
  options: MergedOptions;
  deepMetadata?: SchemaObjectMetadata;
  typeKey?: string;
}

const buildExampleResponse = (settings: ExampleResponseSettings) => {
  const { options, deepMetadata, typeKey = 'type' } = settings;

  const typeArgument = deepMetadata?.type || options[typeKey];
  const isArrayArgument = deepMetadata?.type ? !!deepMetadata.isArray : options.isArray;

  const [_type, isArray] = getTypeIsArrayTuple(typeArgument, isArrayArgument);
  const type = typeKey === 'type' ? resolveLazyTypeFunction(_type) : _type();

  const requiredProperties = [];

  const messageExample: Record<string, any> = {};

  for (const property of accessor.getModelProperties(type.prototype)) {
    const metadata: SchemaObjectMetadata = Reflect.getMetadata(
      DECORATORS.API_MODEL_PROPERTIES,
      type.prototype,
      property,
    );

    metadata.type = resolveLazyTypeFunction(metadata.type);

    if (isClass(metadata.type)) {
      messageExample[property] = buildExampleResponse({ options, deepMetadata: metadata });
    } else {
      messageExample[property] = getExampleValue(metadata);

      if (!deepMetadata && metadata.required) {
        requiredProperties.push(property);
      }
    }
  }

  if (requiredProperties.length && !options.requiredProperties) {
    options.requiredProperties = requiredProperties;
  }

  return isArray ? [messageExample] : messageExample;
};

export const buildMessageByType = (template: Template, options: MergedOptions) => {
  if (!options.userDefinedTemplate && options.type) {
    template.message = buildExampleResponse({ options });
  }
};

export const resolveTypeTemplate = (options: MergedOptions) => {
  if (options?.template && typeof options.template === 'function') {
    options.template = buildExampleResponse({
      options,
      typeKey: 'template',
    });
  }
};
