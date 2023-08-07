import { HttpException } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import { getTypeIsArrayTuple } from '@nestjs/swagger/dist/decorators/helpers';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { resolveTemplatePlaceholders } from './example-content.util';
import { DefaultTemplateRequiredProperties } from './options.util';
import { MergedOptions, Options } from '../interfaces/options.interface';

type SchemaOrReference = SchemaObject | ReferenceObject;

// eslint-disable-next-line @typescript-eslint/ban-types
const buildSwaggerTypeRef = (options: Pick<Options, 'type' | 'isArray'>): SchemaOrReference => {
  const [type, isArray] = getTypeIsArrayTuple(options.type, !!options.isArray);
  const schemaPath = getSchemaPath(type());

  if (isArray) {
    return {
      type: 'array',
      items: {
        type: 'object',
        $ref: schemaPath,
      },
    };
  } else {
    return {
      $ref: schemaPath,
    };
  }
};

export const buildSchema = (options: MergedOptions, exception: HttpException): SchemaObject => {
  const { userDefinedTemplate, requiredProperties } = options;
  const resolvedTemplate = resolveTemplatePlaceholders(options, exception);

  const properties: Record<string, SchemaOrReference> = {};
  for (const [key, value] of Object.entries(resolvedTemplate)) {
    if (key === 'message' && !options.userDefinedTemplate && (options.messageSchema || options.type)) {
      if (options.messageSchema) {
        properties[key] = options.messageSchema;
      } else {
        properties[key] = buildSwaggerTypeRef(options);
      }
    } else {
      properties[key] = {
        type: typeof value,
        example: value,
      };
    }
  }

  let required = DefaultTemplateRequiredProperties;
  if (userDefinedTemplate) {
    if (requiredProperties) {
      required = requiredProperties;
    } else {
      required = Object.keys(resolvedTemplate);
    }
  }

  const optionsSchema = options.enrichSchema ? options.enrichSchema : {};

  return {
    type: 'object',
    description: options.description,
    properties,
    required,
    ...optionsSchema,
  };
};
