import { HttpException } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { MergedOptions } from '../interfaces/options.interface';
import { SchemaOptions } from '../interfaces/schema.interface';
import { resolveTemplatePlaceholders } from './example-content.util';
import { DefaultTemplateRequiredProperties } from './options.util';

const buildSchema = (options: MergedOptions, exception: HttpException): SchemaObject => {
  const resolvedTemplate = resolveTemplatePlaceholders(options.template, exception);

  const properties: Record<string, SchemaObject | ReferenceObject> = {};
  for (const [key, value] of Object.entries(resolvedTemplate)) {
    if (key === 'message' && !options.userDefinedTemplate && (options.schema || options.type)) {
      if (options.schema) {
        properties[key] = options.schema;
      } else {
        properties[key] = {
          $ref: getSchemaPath(options.type()),
        };
      }
    } else {
      properties[key] = {
        type: typeof value,
        example: value,
      };
    }
  }

  return {
    type: 'object',
    description: options.description,
    properties,
    required: options.userDefinedTemplate ? Object.keys(resolvedTemplate) : DefaultTemplateRequiredProperties,
  };
};

export const generateAndApplySchema = ({ content, options, exception }: SchemaOptions) => {
  content[options.contentType].schema = buildSchema(options, exception);
};
