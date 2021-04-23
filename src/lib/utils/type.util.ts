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
  if (typeof metadata.example !== 'undefined') {
    return metadata.example;
  }

  if (metadata.enum?.length) {
    return metadata.enum[0];
  }

  return (metadata.type as () => void).name;
};

const buildExampleMessage = (options: MergedOptions, deepMetadata?: SchemaObjectMetadata) => {
  const typeArgument = deepMetadata?.type || options.type;
  const isArrayArgument = deepMetadata?.type ? !!deepMetadata.isArray : options.isArray;

  const [_type, isArray] = getTypeIsArrayTuple(typeArgument, isArrayArgument);
  const type = resolveLazyTypeFunction(_type);

  const messageExample: Record<string, any> = {};

  for (const property of accessor.getModelProperties(type.prototype)) {
    const metadata: SchemaObjectMetadata = Reflect.getMetadata(
      DECORATORS.API_MODEL_PROPERTIES,
      type.prototype,
      property,
    );

    metadata.type = resolveLazyTypeFunction(metadata.type);

    if (isClass(metadata.type)) {
      messageExample[property] = buildExampleMessage(options, metadata);
    } else {
      messageExample[property] = getExampleValue(metadata);
    }
  }

  return isArray ? [messageExample] : messageExample;
};

export const buildMessageByType = (template: Template, options: MergedOptions) => {
  if (!options.userDefinedTemplate && options.type) {
    template.message = buildExampleMessage(options);
  }
};
